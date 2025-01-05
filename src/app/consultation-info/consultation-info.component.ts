import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarConsultationComponent } from '../sidebar-consultation/sidebar-consultation.component';
import { DossierService } from '../services/dossier.service';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../services/utilisateurs.service';
import { PatientService } from '../services/patient.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { generatePdf } from '../utils/generatePdf';
import { PdfTemplateComponent } from '../pdf-template/pdf-template.component';
import { LaboratoireService } from '../services/laboratoire.service';

@Component({
  selector: 'app-consultation-info',
  standalone: true,
  imports: [
    CommonModule, SidebarConsultationComponent, FormsModule, ReactiveFormsModule, PdfTemplateComponent
  ],
  templateUrl: './consultation-info.component.html',
  styleUrls: ['./consultation-info.component.css']
})
export class ConsultationInfoComponent implements OnInit {
  activeTab: string = 'laboratoire';  // Default tab
  codeDossier: string | null = null;
  dossier: any;
  filterKeyword: string = '';
  filteredExamins: any[] = [];
  selectedExam: any = null;
  isEditingProfile: boolean = false;
  profileFormData: any = {};
  profileForm: FormGroup;
  editMode = false;

  constructor(private route: ActivatedRoute, 
    private dossierService: DossierService,
    private utilisateurService: UtilisateurService,
    private patientService: PatientService, 
    private laboratoireService: LaboratoireService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      nomComplet: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      lieuDeNaissance: ['', Validators.required],
      sexe: ['', Validators.required],
      adresse: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      numTel: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Retrieve the codeDossier from route parameters
    this.codeDossier = this.route.snapshot.paramMap.get('codeDossier');
    console.log('Code Dossier:', this.codeDossier);

    // Fetch dossier information
    this.loadDossierInfo();
  }

  loadDossierInfo(): void {
    if (this.codeDossier) {
      this.dossierService.getDossierByCode(this.codeDossier).subscribe(
        (dossierResponse) => {
          console.log('Dossier Info:', dossierResponse);
          this.dossier = dossierResponse;

          // Fetch related information
          this.fetchAdditionalInfo(dossierResponse);

          // Initialize filteredExamins
          this.filteredExamins = this.dossier.examins || [];
        },
        (error) => {
          console.error('Error fetching dossier info:', error);
        }
      );
    }
  }

  fetchAdditionalInfo(dossier: any): void {
    // Fetch user details
    if (dossier.fkEmailUtilisateur) {
      this.utilisateurService.getUtilisateurByEmail(dossier.fkEmailUtilisateur).subscribe(
        (userResponse) => {
          this.dossier.userDetails = userResponse;
          console.log('User Info:', userResponse);
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );
    }

    // Fetch patient details
    if (dossier.fkIdPatient) {
      this.patientService.getPatient(dossier.fkIdPatient).subscribe(
        (patientResponse) => {
          this.dossier.patientDetails = patientResponse;
          console.log('Patient Info:', patientResponse);
          if (this.dossier.patientDetails.fkIdLaboratoire) {
            this.laboratoireService.publicGetLaboratoireById(this.dossier.patientDetails.fkIdLaboratoire).subscribe(
              (laboResponse) => {
                this.dossier.laboDetails = laboResponse;
                console.log('Labo Info:', laboResponse);
              },
              (error) => {
                console.error('Error fetching labo info:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error fetching patient info:', error);
        }
      );
    }

    // Fetch epreuve and analyse details for each examination
    if (dossier.examins) {
      dossier.examins.forEach((examin: any) => {
        if (examin.fkIdEpreuve) {
          this.dossierService.getEpreuvesByDossier(examin.fkIdEpreuve).subscribe(
            (epreuveResponse) => {
              examin.epreuveDetails = epreuveResponse;
              console.log('Epreuve Info:', epreuveResponse);
            },
            (error) => {
              console.error('Error fetching epreuve info:', error);
            }
          );
        }

        if (examin.fkIdTestAnalyse) {
          this.dossierService.getTestAnalyseByEpreuve(examin.fkIdTestAnalyse).subscribe(
            (analyseResponse) => {
              examin.analyseDetails = analyseResponse;
              console.log('testAnalyse Info:', analyseResponse);
            },
            (error) => {
              console.error('Error fetching analyse info:', error);
            }
          );
        }
      });
    }
  }

  filterExamins(): void {
    const keyword = this.filterKeyword.toLowerCase();
    this.filteredExamins = this.dossier.examins.filter((examin: any) => {
      return (
        examin.uniqueId?.toLowerCase().includes(keyword) ||
        examin.epreuveDetails?.nom?.toLowerCase().includes(keyword) ||
        examin.analyseDetails?.nomTest?.toLowerCase().includes(keyword) ||
        examin.resultat?.toLowerCase().includes(keyword)
      );
    });
  }

  selectExam(exam: any): void {
    this.selectedExam = exam;
  }

  onGeneratePdf(): void {
    console.log('Filtered Examins:', this.filteredExamins);
    const selectedExamins = this.filteredExamins.filter((exam: any) => exam.selected);

    if (selectedExamins.length === 0) {
      alert('Please select at least one examination to generate a PDF report.');
      return;
    }

    this.selectedExam = selectedExamins;

    // Use timeout to ensure the template is updated before fetching the element
    setTimeout(() => {
      const element = document.getElementById('pdf-template');
      if (!element) {
        alert('Error: Unable to find the PDF template.');
        return;
      }
      generatePdf(element, 'examinations-report.pdf');
    }, 100);
  }

  onTabSelected(tab: string): void {
    this.activeTab = tab;
  }

  toggleProfileEdit(): void {
    this.isEditingProfile = !this.isEditingProfile;
  }

  cancelEdit(): void {
    this.isEditingProfile = false;
    this.profileFormData = {};
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const updatedProfile = this.profileForm.value;
      this.patientService.updatePatient(this.dossier.fkIdPatient, updatedProfile).subscribe(
        (response) => {
          console.log('Profile updated successfully:', response);
          this.dossier.userDetails = updatedProfile;
          this.isEditingProfile = false;
        },
        (error) => {
          console.error('Error updating profile:', error);
        }
      );
    }
  }
}

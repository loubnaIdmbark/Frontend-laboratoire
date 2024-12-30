import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarConsultationComponent } from '../sidebar-consultation/sidebar-consultation.component';
import { DossierService } from '../services/dossier.service';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../services/utilisateurs.service';
import { PatientService } from '../services/patient.service';


@Component({
  selector: 'app-consultation-info',
  standalone: true,
  imports: [
    CommonModule, SidebarConsultationComponent,
  ],
  templateUrl: './consultation-info.component.html',
  styleUrls: ['./consultation-info.component.css']
})
export class ConsultationInfoComponent implements OnInit {
  activeTab: string = 'laboratoire';
  codeDossier: string | null = null;
  dossier: any;

  constructor(private route: ActivatedRoute, 
    private dossierService: DossierService,
    private utilisateurService: UtilisateurService,
    private patientService: PatientService  
  ) {}

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
              console.log('Analyse Info:', analyseResponse);
            },
            (error) => {
              console.error('Error fetching analyse info:', error);
            }
          );
        }
      });
    }
  }

  onTabSelected(tab: string): void {
    this.activeTab = tab;
  }
}

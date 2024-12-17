import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule, NgForOf } from '@angular/common';
import { DossierService, dossier } from '../services/dossier.service';
import { PatientService ,patient } from '../services/patient.service';

import {Router, RouterOutlet} from '@angular/router';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-dossier',
  standalone: true,
  templateUrl: './dossier.component.html',
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    RouterOutlet,
    NavbarComponent,
    NgForOf,
    ReactiveFormsModule,
  ],
  styleUrl: './dossier.component.css',
})
export class DossierComponent implements OnInit {
  currentStep: number = 1;
  addPatientForm: FormGroup;
  dossiersAvecPatients: any[] = [];
  filteredDossiers: any[] = [];
  searchQuery: string = '';
  isAddPatientModalVisible: boolean = false;

  constructor(private DossierService: DossierService, private PatientService: PatientService, private fb: FormBuilder , private router: Router) {
    this.addPatientForm = this.fb.group({
      nomComplet: ['', [Validators.required]],
      dateNaissance: ['', [Validators.required]],
      lieuDeNaissance: ['', [Validators.required]],
      sexe: ['', [Validators.required]],
      numPieceIdentite: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      numTel: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      visiblePour: ['', [Validators.required]]
    });
  }
  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  ngOnInit(): void {
    // Charger les dossiers au démarrage
    this.chargerDossiersAvecPatients();
  }

  chargerDossiersAvecPatients(): void {
    this.DossierService.getDossiers().subscribe((dossiers: dossier[]) => {
      const requetesPatients = dossiers.map((dossier) =>
        this.PatientService.getPatient(dossier.fkIdPatient).pipe(
          map((patient: patient) => ({
            ...dossier,
            nomPatient: patient.nomComplet, // Ajouter le nom du patient
          }))
        )
      );

      // Attendre la fin de toutes les requêtes
      forkJoin(requetesPatients).subscribe((resultats) => {
        this.dossiersAvecPatients = resultats;
        this.filteredDossiers = [...resultats]; // Initialiser les dossiers filtrés
      });
    });
  }

  navigateToDetails(fkIdPatient: number): void {
    this.router.navigate(['/patient', fkIdPatient]).then(r => ' ');
  }

  filterDossiers(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredDossiers = this.dossiersAvecPatients.filter((dossier) =>
      dossier.nomPatient?.toLowerCase().includes(query)
    );
  }

  ouvrirDossier(id: number): void {
    console.log('Ouvrir le dossier avec l\'ID:', id);
  }

  toggleModal() {
    this.isAddPatientModalVisible = !this.isAddPatientModalVisible;
  }

  onAddPatientSubmit() {
    // Assurer la validité du formulaire

    const patientData: patient = {
      ...this.addPatientForm.value,
    };

    this.PatientService.addPatient(patientData).subscribe({
      next: (response) => {
        console.log('Patient ajouté avec succès', response);

        // Récupérer l'ID du patient nouvellement créé
        const newPatientId = response.idPatient;

        // Préparer les données du dossier
        const dossierData = {
          fkIdPatient: newPatientId,
          fkEmailUtilisateur: '4567@gmail.com',
          date: new Date().toISOString().split('T')[0],
        };

        // Ajouter le dossier en utilisant DossierService
        this.DossierService.addDossier(dossierData).subscribe({
          next: (dossierResponse) => {
            console.log('Dossier créé avec succès', dossierResponse);
            alert('Patient et dossier ajoutés avec succès');

            // Actualiser la liste des dossiers/patients
            this.chargerDossiersAvecPatients();

            // Fermer le modal et réinitialiser le formulaire
            this.toggleModal();
            this.addPatientForm.reset();
          },
          error: (err) => {
            console.error('Erreur lors de la création du dossier', err);
            alert('Erreur lors de la création du dossier');
          },
        });
      },
      error: (err) => {
        console.error('Erreur lors de la création du patient', err);
        alert('Erreur lors de la création du patient');
      },
    });
  }

}

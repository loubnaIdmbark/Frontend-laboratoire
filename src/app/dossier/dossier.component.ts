import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule, NgForOf } from '@angular/common';
import { DossierService, dossier } from '../laboratoire/dossier.service';
import { PatientService ,patient } from '../laboratoire/patient.service';

import { RouterOutlet } from '@angular/router';
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
  addPatientForm: FormGroup;
  dossiersAvecPatients: any[] = [];
  filteredDossiers: any[] = [];
  searchQuery: string = '';
  isAddPatientModalVisible: boolean = false;

  constructor(private DossierService: DossierService, private PatientService: PatientService, private fb: FormBuilder) {
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
    console.log('test')

      const patientData: patient = {
        ...this.addPatientForm.value,};
      this.PatientService.addPatient(patientData).subscribe({
        next: (response) => {
          console.log('Patient ajouté avec succès', response);
          alert('Patient ajouté avec succès');
          this.toggleModal();
          this.addPatientForm.reset();
        }
      })

  }
}

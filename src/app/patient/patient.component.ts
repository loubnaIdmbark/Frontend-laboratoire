import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../navbar/navbar.component";
import {ActivatedRoute, Router, RouterLink, withPreloading} from '@angular/router';
import {SidebarComponent} from "../sidebar/sidebar.component";
import { patient,PatientService} from '../services/patient.service';
import {Route} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    NgClass,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent implements OnInit  {
  patient: any;
  isEditModalVisible: boolean=false;
  editPatientForm: FormGroup;

  constructor( private route: ActivatedRoute,private PatientService:PatientService,private fb: FormBuilder,) {
    this.editPatientForm = this.fb.group({
      idPatient: [{value: '', disabled: true}], // Champ désactivé pour l'ID
      nomComplet: ['', [Validators.required, Validators.minLength(3)]],
      dateNaissance: ['', [Validators.required]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      sexe: ['', [Validators.required]],
      numTel: ['', [ Validators.required,],],
      email: ['', [Validators.required, Validators.email, // Validation d'email
 ],
      ],
    });
  }
  ngOnInit(): void {
  this.route.params.subscribe(params => {
  console.log('Paramètres de la route :', params);
  const fkIdPatient = +params['fkIdPatient'];
  if (fkIdPatient) {
    this.getPatient(fkIdPatient);


  } else {
  console.error('ID non trouvé dans les paramètres de la route.');
}
});

}

  private getPatient(fkIdPatient: number) {
    this.PatientService.getPatient(fkIdPatient).subscribe({
      next: (response) => {
        console.log('Détails du patient :', response);
        this.patient = response;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des détails du laboratoire :', err);
      },
    });
  }

  modifierPatient() {

  }

  onEditPatientSubmit(idPatient: number) {
    // Afficher le modal
    this.isEditModalVisible = true;
    this.isEditModalVisible = true;

    // Pré-remplir les champs du formulaire avec les données actuelles
    this.editPatientForm.patchValue({
      idPatient: this.patient.idPatient,
      nomComplet: this.patient.nomComplet,
      dateNaissance: this.patient.dateNaissance,
      adresse: this.patient.adresse,
      sexe: this.patient.sexe,
      telephone: this.patient.numTel,
      email: this.patient.email,
    });

    // Récupérer les nouvelles valeurs du formulaire
    const updatedPatient = this.editPatientForm.getRawValue();

    // Créer un objet FormData pour envoyer les données
    const formData = new FormData();

    formData.append('nomComplet', updatedPatient.nomComplet);
    formData.append('dateNaissance', updatedPatient.dateNaissance);
    formData.append('adresse', updatedPatient.adresse);
    formData.append('sexe', updatedPatient.sexe);
    formData.append('numTel', updatedPatient.numTel);
    formData.append('email', updatedPatient.email);

    // Afficher les données dans la console pour vérification
    console.log('Patient mis à jour :', updatedPatient);
    console.log('FormData envoyé :', formData);

    // Appel du service pour mettre à jour le patient
    this.PatientService.updatePatient(idPatient, formData).subscribe({
      next: (response) => {
        console.log('Patient mis à jour avec succès !', response);
        this.isEditModalVisible = false; // Fermer le modal après succès
        this.getPatient(idPatient); // Rafraîchir les données
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du patient :', err);
      },
    });
  }


}

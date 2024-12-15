
import { Component, OnInit } from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {NavbarComponent} from '../navbar/navbar.component';
@Component({
  selector: 'app-profile',
  standalone: true,
    imports: [
        FormsModule,
        NgIf,
        SidebarComponent,
        NavbarComponent,
        ReactiveFormsModule
    ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  utilisateur: any;
  isViewMode: boolean = true; // Affichage par défaut en mode lecture
   isAddUserModalVisible:boolean= false;



  fb: any;
  private  addUtilisateurForm: any;
  constructor() {
}
  ngOnInit(): void {
    this.utilisateur = {
      email: 'user@example.com',
      nomComplet: 'Jean Dupont',
      profession: 'Ingénieur',
      numTel: '0123456789',
      fkIdLaboratoire: '1234',
      signature: 'Signature',
      role: 'Admin'
    };
  }

  editMode() {
    this.isViewMode = false; // Passer en mode édition

  }

  saveProfile() {
    console.log('Profil sauvegardé', this.utilisateur);
    this.isViewMode = true; // Retour en mode affichage
  }

  cancel() {
    console.log('Annuler');
    this.isViewMode = true; // Retour en mode affichage sans sauvegarde
  }
  toggleAddUserModal(): void {
    this.isAddUserModalVisible = !this.isAddUserModalVisible;

    console.log(this.isAddUserModalVisible)
  }
}















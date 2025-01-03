import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

import { SidebarComponent } from '../sidebar/sidebar.component';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from '../navbar/navbar.component';
import {AuthService} from '../services/login.service';
@Component({

  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, SidebarComponent, FormsModule, NavbarComponent, ReactiveFormsModule],
  standalone: true
})
export class ProfileComponent implements OnInit {
  public username: string | null = 'null';
  user = {
    nomComplet: 'loubna',
    email: 'jean.dupont@example.com',
    telephone: '06 12 34 56 78',
    profession: 'Docteur',
    role: 'docteur',
    avatar: null
  };

  profileForm!: FormGroup;
  editMode = false;
  isAddUserModalVisible: any;



  constructor(private fb: FormBuilder,private AuthService:AuthService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nomComplet: [this.user.nomComplet],
      email: [this.user.email],
      telephone: [this.user.telephone],
      profession: [this.user.profession],
      role: [this.user.role]
    });

  
  }

  saveProfile(): void {
    this.user = { ...this.user, ...this.profileForm.value };
    this.editMode = false;
    console.log('Profil mis à jour :', this.user);
  }

  toggleAddUserModal() {

  }
}

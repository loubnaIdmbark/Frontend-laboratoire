import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/login.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, SidebarComponent, FormsModule, NavbarComponent, ReactiveFormsModule],
  standalone: true
})
export class ProfileComponent implements OnInit {
  public username: string | null = null;
  user: any = null;

  profileForm!: FormGroup;
  editMode = false;
  isAddUserModalVisible: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    // Récupérer le nom d'utilisateur
    this.username = this.authService.getUsername();
    console.log('Username in ProfileComponent:', this.username);

    if (this.username) {
      // Récupérer les données utilisateur en fonction du username
      this.getUserData(this.username);
    }
  }

  // Fonction pour récupérer les données utilisateur
  getUserData(username: string): void {
    this.http.get<any>(`http://localhost:8088/utilisateurs/${username}`).subscribe(
      (userData) => {
        this.user = userData;
        console.log('User data retrieved:', this.user);

        // Initialiser le formulaire avec les données utilisateur
        this.profileForm = this.fb.group({
          nomComplet: [this.user.nomComplet],
          email: [this.user.email],
          telephone: [this.user.numTel],
          profession: [this.user.profession],
          role: [this.user.role]
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
      }
    );
  }

  saveProfile(): void {
    this.user = { ...this.user, ...this.profileForm.value };
    this.editMode = false;
    console.log('Profil mis à jour :', this.user);
  }

  toggleAddUserModal(): void {
    this.isAddUserModalVisible = !this.isAddUserModalVisible;
  }
}

import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { consultationService } from '../services/consultation.service';

@Component({
  selector: 'app-consultation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css'],
})
export class ConsultationComponent {
  codeDossier = '';
  codeVerification = '';
  dossier: any;
  consultationForm: FormGroup;
  verificationForm: FormGroup;
  emailForm: FormGroup;
  showVerificationModal = false; // Track if the verification modal is visible
  showEmailModal = false;
  errorMessage = '';
  emailErrorMessage = '';


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private consultationService: consultationService
  ) {
    this.consultationForm = this.fb.group({
      codeDossier: ['', [Validators.required]],
    });

    this.verificationForm = this.fb.group({
      codeVerification: ['', [Validators.required]],
    });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Function to handle the submission of codeDossier
  onSubmitCodeDossier() {
    const codeDossier = this.consultationForm.value.codeDossier;

    // Call the service to validate the codeDossier
    this.consultationService.validateCodeDossier(codeDossier).subscribe(
      (response) => {
        console.log('Code Dossier validated successfully:', response);
        this.dossier = response;
        this.showVerificationModal = true;
        // Optionally, send a request to generate and send the verification code
        this.consultationService.sendVerificationCode(this.dossier.fkIdPatient).subscribe(
          (res) => {
            this.codeVerification = res;
          },
          (err) => {
            this.errorMessage = 'Erreur: Code Dossier incorrect ou non trouvé.';
          }
        );
      },
      (error) => {
        this.errorMessage = 'Code Dossier incorrect ou non trouvé.';
      }
    );
  }

  // Function to handle the submission of verification code
  onSubmitVerificationCode() {
    const codeDossier = this.consultationForm.value.codeDossier;
    const codeVerification = this.verificationForm.value.codeVerification;

    if (this.codeVerification == codeVerification) {
      this.router.navigate(['/consultation-info', codeDossier]);
    }
    else {
      this.errorMessage = 'Code de vérification incorrect.';
    }
  }

  // Function to close the verification modal
  closeModal() {
    this.showVerificationModal = false;
    this.errorMessage = '';
    this.verificationForm.reset();
  }

  // Function to handle "Code oublié?"
  onForgotCode() {
    this.showEmailModal = true; // Show the email modal
    this.emailErrorMessage = '';
    this.emailForm.reset();
  }

  // Function to handle email submission
  onSubmitEmail() {
    const email = this.emailForm.value.email;

    this.consultationService.sendRecoveryCode(email).subscribe(
      (response) => {
        console.log('Recovery code sent successfully:', response);
        this.showEmailModal = false;
        this.errorMessage = 'Un code de récupération a été envoyé à votre email.';
      },
      (error) => {
        console.error('Error sending recovery code:', error);
        this.emailErrorMessage = "Erreur: Impossible d'envoyer le code de récupération. Veuillez vérifier votre email.";
      }
    );
  }

  // Function to close the email modal
  closeEmailModal() {
    this.showEmailModal = false;
    this.emailErrorMessage = '';
  }
}

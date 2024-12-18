import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/login.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogin: boolean = true;
  loginForm: FormGroup;
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService // Inject the AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  toggleAuthMode() {
    this.isLogin = !this.isLogin;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const mode = params['mode'];
      this.isLogin = mode !== 'signup'; // If mode = 'signup', switch to signup mode
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).pipe(
        catchError(err => {
          this.errorMessage = 'Login failed. Please check your credentials.';
          return of(null);
        })
      ).subscribe({
        next: (response) => {
          if (response) {
            // Navigate to a secure page after successful login
            this.router.navigate(['/dashboard']);
            console.log('Login successful :' , this.authService.getAccessToken());
          }
        },
        error: (err) => {
          this.errorMessage = 'An unexpected error occurred.';
        }
      });
    }
  }
}

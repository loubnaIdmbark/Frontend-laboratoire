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
    imports: [
        ReactiveFormsModule,
        CommonModule,
    ],
    styleUrls: ['./login.component.css'],
    standalone: true
})
export class LoginComponent implements OnInit {
  isLogin = true; // Tracks whether we're in login or signup mode
  loginForm: FormGroup;
  signupForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Check token validity and refresh token if needed
    if (this.authService.hasValidToken()) {
      this.authService.refreshToken().subscribe(
        () => {
          this.router.navigate(['/laboratoire']); // Redirect to app on valid token
        },
        (err) => {
          console.log('Token refresh failed:', err);
        }
      );
    }
  }

  // Toggle between login and signup modes
  toggleAuthMode(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = ''; // Clear any errors when switching modes
  }

  // Handle login
  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService
        .login(email, password)
        .pipe(
          catchError((err) => {
            this.errorMessage = 'Login failed. Please check your credentials.';
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response) {
            console.log('Login successful', response);
            this.router.navigate(['/laboratoire']); // Navigate to dashboard on success
          }
        });
    }
  }
}

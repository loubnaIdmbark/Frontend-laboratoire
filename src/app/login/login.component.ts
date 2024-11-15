import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {ActivatedRoute} from '@angular/router';
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

  constructor(private fb: FormBuilder , private route: ActivatedRoute) {
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
      this.isLogin = mode !== 'signup'; // Si mode = 'signup', passez en mode inscription
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      // logique de connexion
    }
  }

  onSignup() {
    if (this.signupForm.valid) {
      // logique d'inscription
    }
  }
}

import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['login']).then(r => '');
  }
  navigateToSignin(): void {
    this.router.navigate(['/login', 'signup']).then(r => '');
  }

}

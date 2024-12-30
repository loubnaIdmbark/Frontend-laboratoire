import { Component } from '@angular/core';
import { AuthService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    imports: [],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    standalone: true
})
export class NavbarComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
  ){}

  logOut() : void {
    this.authService.logout();
  }

}

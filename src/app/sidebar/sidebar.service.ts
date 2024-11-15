import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private menuItems = [
    { label: 'Accueil', link: '/home', icon: 'fas fa-home' },
    { label: 'Laboratoires', link: '/laboratoires', icon: 'fas fa-flask' },
    { label: 'Utilisateurs', link: '/utilisateurs', icon: 'fas fa-users' },
    { label: 'Patients', link: '/patients', icon: 'fas fa-user-injured' },
    { label: 'Analyses', link: '/analyses', icon: 'fas fa-vial' },
    { label: 'Paramètres', link: '/parametres', icon: 'fas fa-cog' },
    { label: 'Aide', link: '/aide', icon: 'fas fa-question-circle' }
  ];

  getMenuItems() {
    return this.menuItems;
  }
}

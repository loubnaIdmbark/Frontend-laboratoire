import { NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Component, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './sidebar-consultation.component.html',
  styleUrls: ['./sidebar-consultation.component.css'],
})
export class SidebarConsultationComponent {
  @Output() tabSelected = new EventEmitter<string>();
  activeMenu: string = 'laboratoire'; // Default active menu
  isSidebarCollapsed: boolean = false;
  @Input() labo : any;

  constructor(private router: Router) {}

  // Handles logout and redirects to consultation
  logout(): void {
    this.router.navigate(['/consultation']);
  }

  // Toggles the sidebar collapsed state
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Sets the active section and emits the selected tab
  toggleSection(section: string): void {
    this.activeMenu = section;
    this.tabSelected.emit(section);
  }
}

import { Component } from '@angular/core';
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  activeMenu: string = 'labs';
  isSidebarCollapsed: boolean = false;
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

}

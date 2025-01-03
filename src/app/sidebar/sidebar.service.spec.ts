import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: { label: string; link: string; icon: string }[] = [];


  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.menuItems = this.sidebarService.getMenuItems();
  }
}

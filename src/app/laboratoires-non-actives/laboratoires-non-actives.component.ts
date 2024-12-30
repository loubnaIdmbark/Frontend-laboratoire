import { Component, OnInit } from '@angular/core';
import {
  Laboratoire,
  LaboratoireService,
} from '../services/laboratoire.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-laboratoires-non-actives',
  templateUrl: './laboratoires-non-actives.component.html',
  standalone: true,
  styleUrls: ['./laboratoires-non-actives.component.css'],
  imports: [CommonModule, SidebarComponent, FormsModule, NavbarComponent],
})
export class LaboratoiresNonActivesComponent implements OnInit {
  selectedLaboratoireId: null | number = null;
  laboratoires: Laboratoire[] = [];
  filteredLaboratoires: Laboratoire[] = [];
  searchQuery: string = ''; // Valeur de recherche
  private formValue: any;

  constructor(private laboratoireService: LaboratoireService) {}

  ngOnInit(): void {
    this.chargerLaboratoires();
  }
  filterLaboratoires(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredLaboratoires = this.laboratoires.filter((laboratoire) =>
      laboratoire.nom.toLowerCase().includes(query)
    );
  }

  selectLaboratoire(laboratoireId: number): void {
    this.selectedLaboratoireId =
      this.selectedLaboratoireId === laboratoireId ? null : laboratoireId;
  }

  activerLaboratoire(id: number): void {
    this.laboratoireService.getLaboratoireById(id).subscribe({
      next: (laboratoire: Laboratoire) => {
        if (laboratoire) {
          // Modify the 'active' attribute and set activation date
          laboratoire.active = true;
          laboratoire.dateActivation = new Date().toISOString().split('T')[0];
  
          // Prepare the payload
          const payload: any = { ...laboratoire };
  
          // Handle the logo file if it exists
          if (payload.logo instanceof File) {
            const reader = new FileReader();
            reader.onload = (event: any) => {
              // Convert the logo to Base64 and update the payload
              payload.logo = event.target.result.split(',')[1];
  
              // Send the JSON payload with the Base64 string
              this.sendActivateRequest(id, payload);
            };
            reader.readAsDataURL(payload.logo); // Read the file as Base64
          } else {
            // If no file, send the JSON payload directly
            this.sendActivateRequest(id, payload);
          }
        }
      },
      error: (err) => {
        console.error(`Erreur lors de la récupération du laboratoire ${id} :`, err);
      },
    });
  }
  
  private sendActivateRequest(id: number, payload: any): void {
    this.laboratoireService.updateLaboratoroire(id, payload).subscribe({
      next: () => {
        console.log(`Laboratoire ${id} activé avec succès.`);
        alert('Laboratoire activé avec succès.');
        this.laboratoires = this.laboratoires.filter((labo) => labo.id !== id);
        this.filteredLaboratoires = [...this.laboratoires];
      },
      error: (err) => {
        console.error(`Erreur lors de l'activation du laboratoire ${id} :`, err);
        alert("Une erreur est survenue lors de l'activation du laboratoire.");
      },
    });
  }

  chargerLaboratoires(): void {
    this.laboratoireService.getLaboratoire().subscribe({
      next: (data) => {
        // Filtrer uniquement les laboratoires avec actif == false
        this.laboratoires = data.filter((labo: any) => labo.active === false);
        this.filteredLaboratoires = [...this.laboratoires];
      },
      error: (err) =>
        console.error('Erreur lors du chargement des laboratoires :', err),
    });
  }
}

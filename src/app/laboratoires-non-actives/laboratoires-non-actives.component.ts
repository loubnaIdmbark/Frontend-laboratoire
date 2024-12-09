import { Component, OnInit } from '@angular/core';
import { Laboratoire, LaboratoireService } from '../laboratoire/laboratoire.service';
import {CommonModule} from '@angular/common';
import {SidebarComponent} from '../sidebar/sidebar.component'
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-laboratoires-non-actives',
  templateUrl: './laboratoires-non-actives.component.html',
  standalone: true,
  styleUrls: ['./laboratoires-non-actives.component.css'],
  imports: [
    CommonModule,
    SidebarComponent,
    FormsModule
  ]
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
    this.selectedLaboratoireId = this.selectedLaboratoireId === laboratoireId ? null : laboratoireId;
  }


  activerLaboratoire(id: number): void {
    this.laboratoireService.getLaboratoireById(id).subscribe({
      next: (laboratoire: Laboratoire) => {
        if (laboratoire) {
          // Étape 1 : Modifier l'attribut 'active'
          laboratoire.active = true;

          // Étape 2 : Transformer l'objet en FormData
          const formData = new FormData();
          Object.entries(laboratoire).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formData.append(key, value as string | Blob);
            }
          });

          // Étape 3 : Appeler updateLaboratoroire avec le FormData
          this.laboratoireService.updateLaboratoroire(id, formData).subscribe({
            next: () => {
              console.log(`Laboratoire ${id} activé avec succès.`);
              alert('Laboratoire archivé avec succès.');
              this.laboratoires = this.laboratoires.filter(labo => labo.id !== id);
              this.filteredLaboratoires = [...this.laboratoires];

            },
            error: (err) => {
              console.error(`Erreur lors de la mise à jour du laboratoire ${id} :`, err);
              alert('Une erreur est survenue lors de l\'activation du laboratoire.');
            }
          });
        }
      },
      error: (err) => console.error(`Erreur lors de la récupération du laboratoire ${id} :`, err)
    });
  }






  chargerLaboratoires(): void {
    this.laboratoireService.getLaboratoire().subscribe({
      next: (data) => {
        // Filtrer uniquement les laboratoires avec actif == false
        this.laboratoires = data.filter((labo: any) => labo.active === false);
        this.filteredLaboratoires = [...this.laboratoires];
      },
      error: (err) => console.error('Erreur lors du chargement des laboratoires :', err)
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Laboratoire, LaboratoireService } from './laboratoire.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-laboratoire',
  templateUrl: './laboratoire.component.html',
  styleUrls: ['./laboratoire.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    FormsModule
  ],
  standalone: true
})
export class LaboratoireComponent implements OnInit {
  activeMenu: string = 'labs';
  isModalVisible: boolean = false;
  laboratoires: Laboratoire[] = [];
  laboratoireForm: FormGroup;
  selectedLaboratoire: Laboratoire | null = null;  // Variable pour stocker le laboratoire sélectionné
  isSidebarCollapsed: boolean = false;
  constructor(private laboratoireService: LaboratoireService, private fb: FormBuilder) {
    this.laboratoireForm = this.fb.group({
      nom: ['', Validators.required],
      nrc: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      logo: [null],
      active: [false],
      dateActivation: ['', Validators.required],
    });
  }


  searchQuery = ''; // Valeur de recherche
  filteredLaboratoires = this.laboratoires; // Liste filtrée



  // Méthode de filtrage

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }



  ngOnInit(): void {
    this.chargerLaboratoires();
  }

  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible;
    if (!this.isModalVisible) {
      this.laboratoireForm.reset();
    }
  }

  onSubmit(): void {
    if (this.laboratoireForm.valid) {
      const laboratoire = this.laboratoireForm.value;
      if (!laboratoire.logo) {
        laboratoire.logo = null;
      }

      const currentDate = new Date();
      const dateActivation = new Date(laboratoire.dateActivation);
      if (dateActivation < currentDate) {
        alert('La date d\'activation ne peut pas être dans le passé.');
        return;
      }

      this.laboratoireService.addLaboratoire(laboratoire).subscribe({
        next: () => {
          alert('Laboratoire ajouté avec succès !');
          this.chargerLaboratoires();
          this.toggleModal();
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout du laboratoire :', err);
          alert('Erreur lors de l’ajout du laboratoire.');
        }
      });
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }

  chargerLaboratoires(): void {
    this.laboratoireService.getLaboratoire().subscribe({
      next: (data) => {
        this.laboratoires = data;
        this.filteredLaboratoires = [...this.laboratoires]; // Copie initiale
      },
      error: (err) => console.error('Erreur lors du chargement des laboratoires :', err),
    });
  }

  // Filtrer les laboratoires selon la recherche
  filterLaboratoires(): void {
    const query = this.searchQuery.toLowerCase().trim(); // Normalisation
    this.filteredLaboratoires = this.laboratoires.filter(laboratoire =>
      laboratoire.nom.toLowerCase().includes(query)
    );
  }


  archiverLaboratoire(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir archiver ce laboratoire ?')) {
      this.laboratoireService.deleteLaboratory(id).subscribe({
        next: () => {
          alert('Laboratoire archivé avec succès.');
          this.chargerLaboratoires();
        },
        error: (err) => console.error('Erreur lors de l’archivage :', err)
      });
    }
  }

  toggleDetails(laboratoire: Laboratoire): void {
    this.selectedLaboratoire = this.selectedLaboratoire === laboratoire ? null : laboratoire;
  }

  // Méthode pour gérer le changement de fichier (conversion en base64)
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Veuillez sélectionner un fichier image au format JPEG ou PNG');
        return;
      }

      const maxSizeMB = 1;
      if (file.size / 1024 / 1024 > maxSizeMB) {
        alert('Le fichier est trop volumineux. La taille maximale est de 1 Mo.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // L'image est encodée en base64, ajouter le type MIME à la chaîne.
        const base64Image = reader.result as string;
        this.laboratoireForm.patchValue({
          logo: base64Image
        });
      };
      reader.readAsDataURL(file);
    }
  }
}

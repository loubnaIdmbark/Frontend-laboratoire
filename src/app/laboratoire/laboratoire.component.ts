import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Laboratoire, LaboratoireService } from './laboratoire.service';
import {CommonModule, DatePipe} from '@angular/common';
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
  isSidebarCollapsed: boolean = false;
  laboratoires: Laboratoire[] = [];
  filteredLaboratoires: Laboratoire[] = [];
  selectedLaboratoire: Laboratoire | null = null;

  currentStep: number = 1; // Étape actuelle
  laboratoireForm: FormGroup;
  searchQuery: string = ''; // Valeur de recherche

  constructor(private laboratoireService: LaboratoireService, private fb: FormBuilder) {
    this.laboratoireForm = this.fb.group({
      // Étape 1 : Informations sur le laboratoire
      nom: ['', Validators.required],
      nrc: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      logo: [null],
      dateActivation: ['', Validators.required],
      active: [false],

      // Étape 2 : Adresse
      numVoie: [null, Validators.required],
      nomVoie: ['', Validators.required],
      codePostal: [null, [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      ville: ['', Validators.required],
      commune: ['', Validators.required],

      // Étape 3 : Contact
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.chargerLaboratoires();
  }

  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible;
    if (!this.isModalVisible) {
      this.laboratoireForm.reset();
      this.currentStep = 1; // Réinitialise l'étape à 1
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Navigation entre les étapes
  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Gestion de la soumission
  onSubmit(): void {
    if (this.laboratoireForm.valid) {
      const laboratoire = this.laboratoireForm.value;

      if (!laboratoire.logo) {
        laboratoire.logo = null;
      }

      // Validation de la date d'activation
      const currentDate = new Date();
      const dateActivation = new Date(laboratoire.dateActivation);
      if (dateActivation < currentDate) {
        alert('La date d\'activation ne peut pas être dans le passé.');
        return;
      }

      // Appel au service pour ajouter un laboratoire
      this.laboratoireService.addLaboratoire(laboratoire).subscribe({
        next: () => {
          alert('Laboratoire ajouté avec succès !');
          this.chargerLaboratoires();
          this.toggleModal();
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout du laboratoire :', err);
          alert('Erreur lors de l’ajout du laboratoire.');
        },
      });
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }

  chargerLaboratoires(): void {
    this.laboratoireService.getLaboratoire().subscribe({
      next: (data) => {
        this.laboratoires = data;
        this.filteredLaboratoires = [...this.laboratoires];
      },
      error: (err) => console.error('Erreur lors du chargement des laboratoires :', err),
    });
  }

  // Filtrer les laboratoires selon la recherche
  filterLaboratoires(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredLaboratoires = this.laboratoires.filter((laboratoire) =>
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
        error: (err) => console.error('Erreur lors de l’archivage :', err),
      });
    }
  }

  toggleDetails(laboratoire: Laboratoire): void {
    this.selectedLaboratoire = this.selectedLaboratoire === laboratoire ? null : laboratoire;
  }

  // Gestion du fichier logo (conversion en base64)
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
        const base64Image = reader.result as string;
        this.laboratoireForm.patchValue({ logo: base64Image });
      };
      reader.readAsDataURL(file);
    }
  }
}

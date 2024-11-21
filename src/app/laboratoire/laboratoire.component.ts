import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Laboratoire, LaboratoireService } from './laboratoire.service';
import {CommonModule, DatePipe} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {SidebarComponent} from '../sidebar/sidebar.component';
@Component({
  selector: 'app-laboratoire',
  templateUrl: './laboratoire.component.html',
  styleUrls: ['./laboratoire.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    FormsModule,
    RouterOutlet,
    SidebarComponent,
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
  adresseForm: FormGroup;
  contactForm: FormGroup;
  searchQuery: string = ''; // Valeur de recherche

  constructor(private laboratoireService: LaboratoireService, private fb: FormBuilder,private router: Router) {
    // Formulaire pour le laboratoire
    this.laboratoireForm = this.fb.group({
      nom: ['', Validators.required],
      nrc: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      logo: [null],
      dateActivation: ['', Validators.required],
      active: [false],
    });

    // Formulaire pour l'adresse
    this.adresseForm = this.fb.group({
      numVoie: [null, Validators.required],
      nomVoie: ['', Validators.required],
      codePostal: [null, [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      ville: ['', Validators.required],
      commune: ['', Validators.required],
    });

    // Formulaire pour le contact
    this.contactForm = this.fb.group({
      numTel: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      fax: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.chargerLaboratoires();
  }

  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible;
    if (!this.isModalVisible) {
      this.resetForms();
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  resetForms(): void {
    this.laboratoireForm.reset();
    this.adresseForm.reset();
    this.contactForm.reset();
    this.currentStep = 1;
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
    if (this.laboratoireForm.valid ) {
      const laboratoire = this.laboratoireForm.value;
      const adresse = this.adresseForm.value;
      const contact = this.contactForm.value;

      // Étape 1 : Ajouter le laboratoire
      this.laboratoireService.addLaboratoire(laboratoire).subscribe({
        next: (response) => {
          const labId = response.id;  // Récupération de l'ID du laboratoire
          console.log(labId);
          alert('Laboratoire ajouté avec succès !');

          // Étape 2 : Ajouter l'adresse
          this.laboratoireService.addAdresseLaboratoire(adresse).subscribe({
            next: (adresseResponse) => {
              const adresseId = adresseResponse.id;  // Récupération de l'ID de l'adresse
              console.log(adresseId);

              // Étape 3 : Ajouter le contact avec labId et adresseId
              const contactWithFk = { ...contact, laboratoire: { id: labId },  adresse: { id: adresseId } };
              this.laboratoireService.addContactLaboratoire(contactWithFk).subscribe({
                next: () => {

                  this.chargerLaboratoires();
                  this.toggleModal();

                },
                error: (err) => {
                  console.error('Erreur lors de l’ajout du contact :', err);
                  alert('Erreur lors de l’ajout du contact.');
                },
              });
            },
            error: (err) => {
              console.error('Erreur lors de l’ajout de l’adresse :', err);
              alert('Erreur lors de l’ajout de l’adresse.');
            },
          });
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout du laboratoire :', err);
          alert('Erreur lors de l’ajout du laboratoire.');
        },
      });
    } else {
      alert('Veuillez remplir tous les formulaires correctement.');
    }
  }

  navigateToDetails(id: number): void {
    this.router.navigate(['/details', id]).then(r => ' ');
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

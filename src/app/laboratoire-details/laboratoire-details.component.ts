import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, withPreloading} from '@angular/router';
import {ContactLaboratoire, LaboratoireService} from '../laboratoire/laboratoire.service';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-laboratoire-details',
  templateUrl: './laboratoire-details.component.html',
  styleUrls: ['./laboratoire-details.component.css'],
  imports: [
    DatePipe,
    NgIf,
    SidebarComponent,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
  ],
  standalone: true
})
export class LaboratoireDetailsComponent implements OnInit {
  isModalVisible: boolean = false;
  contactForm: FormGroup;
  laboratoire: any;
  contacts: ContactLaboratoire[] = [];
  editLaboratoireForm: FormGroup;
  isLoading: boolean = false; // Pour afficher un état de chargement
  errorMessage: string | null = null;
  isEditModalVisible: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private laboratoireService: LaboratoireService,
  private cdr: ChangeDetectorRef
  ) {this.contactForm = this.fb.group({
    numTel: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    fax: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],})
    this.editLaboratoireForm = this.fb.group({
      id: [{value: '', disabled: true}], // ID non modifiable
      nom: ['', [Validators.required, Validators.minLength(3)]],
      nrc: ['', [Validators.required]],
      logo: [null],
      dateActivation: ['', [Validators.required]],
      active: [false],
    });}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Paramètres de la route :', params);
      const id = +params['id'];
      if (id) {
        this.getLaboratoireDetails(id);
      } else {
        console.error('ID non trouvé dans les paramètres de la route.');
      }
    });
    this.loadContacts();
  }
  archiverLaboratoire(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir archiver ce laboratoire ?')) {
      this.laboratoireService.deleteLaboratory(id).subscribe({
        next: () => {
          alert('Laboratoire archivé avec succès.');
          this.router.navigate(['/laboratoire',]).then(r => ' ');
        },
        error: (err) => console.error('Erreur lors de l’archivage :', err),
      });
    }
  }


  toggleModalEdit(laboratoire: any): void {
    console.log('openEditModal called with:', laboratoire); // Debug log
    this.isEditModalVisible = true;
    this.isModalVisible = false;
    this.editLaboratoireForm.patchValue({
      id: laboratoire.id,
      nom: laboratoire.nom,
      nrc: laboratoire.nrc,
      dateActivation: laboratoire.dateActivation,
      active: laboratoire.active,
    });
    this.cdr.markForCheck(); // Forcer la mise à jour de l'affichage si nécessaire
    console.log('isEditModalVisible:', this.isEditModalVisible);
  }
  closeEditModal(): void {
    this.isEditModalVisible = false;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files as FileList | null;

    if (files && files.length > 0) {
      const file = files[0]; // Ici, on accède directement sans ambiguïté
      this.editLaboratoireForm.patchValue({ logo: file });
    } else {
      console.warn('Aucun fichier ou input vide.');
    }
  }


  onEditLaboratoireSubmit(id:number): void {
    if (this.editLaboratoireForm.valid) {
      const formData = new FormData();
      Object.entries(this.editLaboratoireForm.getRawValue()).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Ajouter les données au FormData
          if (key === 'logo' && value instanceof File) {
            formData.append(key, value); // Gestion spécifique pour les fichiers
          } else {
            formData.append(key, value as string | Blob);
          }
        }
      });

      this.laboratoireService.updateLaboratoroire(id, formData).subscribe({

        next: () => {
          console.log(formData)
          this.isEditModalVisible = false;
          this.getLaboratoireDetails(id);
        },
        error: (err) => {
          console.error('Erreur lors de la modification du laboratoire :', err);
          alert('Une erreur est survenue lors de la modification.');
        },
      });
    }
  }

  updateLaboratoroire(id: number): void {
      this.laboratoireService.updateLaboratoroire(id, this.laboratoire).subscribe({
        next: () => {
          alert('Laboratoire mofidié avec succès.');

        }}
      ) }


  loadContacts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.getLaboratoireContacts(this.laboratoire.id);
  }

  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible;
    if (this.isModalVisible) {
      this.isEditModalVisible = false; // S'assurer que le modal de modification est fermé
    } else {
      this.resetForms();
    }
  }

  resetForms(): void {
    this.contactForm.reset();
    this.editLaboratoireForm.reset();
  }
  onSubmit(labId:number,adresseId:number): void {
      const contact = this.contactForm.value;


      const contactWithFk = { ...contact, laboratoire: { id: labId }, adresse: { id: adresseId } };
    console.log(contactWithFk)
      this.laboratoireService.addContactLaboratoire(contactWithFk).subscribe({

        next: () => {
          this.toggleModal();
          alert('Contact ajouté avec succès !');
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout du contact :', err);
          alert('Erreur lors de l’ajout du contact.');
        }
      });


  }


  getLaboratoireDetails(id: number): void {
    this.laboratoireService.getLaboratoireById(id).subscribe({
      next: (response) => {
        console.log('Détails du laboratoire :', response);
        this.laboratoire = response;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des détails du laboratoire :', err);
      },
    });
  }
  getLaboratoireContacts(laboratoireId: number): void {
    this.laboratoireService.getContact().subscribe({
      next: (contacts) => {
        const filteredContacts = contacts.filter(contact => contact.fkIdLaboratoire === laboratoireId);
        this.contacts = filteredContacts.slice(0, 50); // Limiter à 50 contacts
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des contacts :', err);
      },
    });
  }

}

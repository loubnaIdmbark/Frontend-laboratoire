import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, withPreloading} from '@angular/router';
import {ContactLaboratoire, Laboratoire, LaboratoireService} from '../laboratoire/laboratoire.service';
import {utilisateur , UtilisateurService} from '../laboratoire/utilisateurs.service'
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
  addUtilisateurForm: FormGroup;
  isAddUserModalVisible = false;
  showLaboratoire = true; // Affiché par défaut
  showContacts = false;
  showUtilisateurs = false;
  isModalVisible: boolean = false;
  contactForm: FormGroup;
  laboratoire: any;
  utilisateur:any;
  contacts: ContactLaboratoire[] = [];
  editLaboratoireForm: FormGroup;
  isLoading: boolean = false; // Pour afficher un état de chargement
  errorMessage: string | null = null;
  isEditModalVisible: boolean = false;
  laboratoires: Laboratoire[] = [];
  filteredLaboratoires: Laboratoire[] = [];
  constructor(
    private fb: FormBuilder,
    private utilisateurService: UtilisateurService,

    private router: Router,
    private route: ActivatedRoute,
    private laboratoireService: LaboratoireService,
  private UtilisateurService:UtilisateurService,
  private cdr: ChangeDetectorRef
  ) {this.contactForm = this.fb.group({
    numTel: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    fax: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],})


      this.addUtilisateurForm = this.fb.group({
        nomComplet: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        profession: ['', Validators.required],
        numTel: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        signature: [''],
        role: ['', Validators.required],
        fkIdLaboratoire: [null],
        password: [''],
      })
    this.editLaboratoireForm = this.fb.group({
      id: [{value: '', disabled: true}],
      nom: ['', [Validators.required, Validators.minLength(3)]],
      nrc: ['', [Validators.required]],
      logo: [null],
      dateActivation: ['', [Validators.required]],
      active: [false],
    });}

  toggleAddUserModal(): void {
    this.isAddUserModalVisible = !this.isAddUserModalVisible;
  }
  onAddUtilisateurSubmit(laboratoireId: number): void {
    if (this.addUtilisateurForm.valid) {
      const utilisateurData: utilisateur = {
        ...this.addUtilisateurForm.value,
        fkIdLaboratoire: laboratoireId,
        id: 0,
      };

      this.utilisateurService.addUtilisateurs(utilisateurData).subscribe({
        next: (response) => {
          console.log('Utilisateur ajouté avec succès', response);
          alert('Utilisateur ajouté avec succès');
          this.toggleAddUserModal();
          this.addUtilisateurForm.reset();
          this.getUtilisateur(laboratoireId);

        },

        error: (err) => {
          console.error('Erreur lors de l\'ajout de l\'utilisateur', err);
          alert('Une erreur est survenue lors de l\'ajout de l\'utilisateur.');
        },
      });

    } else {
      alert('Veuillez remplir tous les champs requis correctement.');
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Paramètres de la route :', params);
      const id = +params['id'];
      if (id) {
        this.getLaboratoireDetails(id);
        this.getUtilisateur(id)
      } else {
        console.error('ID non trouvé dans les paramètres de la route.');
      }
    });
    this.loadContacts();
  }
 deleteLaboratoire(id: number): void {
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
  deleteUtilisateur(email:string , id :number):void{
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.utilisateurService.deleteUser(email).subscribe({
        next: () => {
          alert('Utilisateur supprimé avec succès.');
          this.getUtilisateur(id);
        },
        error: (err) => console.error('Erreur lors du suppression :', err),
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

  getUtilisateur(id: number): void {
    this.UtilisateurService.getUtilisateurs().subscribe(
      (utilisateurs) => {
        // Filtrage des utilisateurs par fkIdLaboratoire
        this.utilisateur = utilisateurs.filter(user => user.fkIdLaboratoire === id);
        console.log("les utilisateurs sont :", utilisateurs); },

      (error) => {
        console.error('Erreur lors du chargement des utilisateurs :', error);
      }
    );
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

  DesActiverLaboratoire(id: number): void {
    this.laboratoireService.getLaboratoireById(id).subscribe({
      next: (laboratoire: Laboratoire) => {
        if (laboratoire) {
          // Étape 1 : Modifier l'attribut 'active'
          laboratoire.active = false;

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
              alert('Laboratoire archivé avec succès.');
              console.log(`Laboratoire ${id} desactivé avec succès.`);
              this.laboratoires = this.laboratoires.filter(labo => labo.id !== id);
              this.filteredLaboratoires = [...this.laboratoires];
              this.router.navigate(['/laboratoire',]).then(r => ' ');

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
          this.getLaboratoireDetails(labId);
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

  deleteContact(id:number):void{
    if (confirm('Êtes-vous sûr de vouloir supprimer cecontact ?')) {
      this.laboratoireService.deleteContact(id).subscribe({
        next: () => {
          alert('Contact supprimé avec succès.');
          this.getLaboratoireContacts(id);
        },
        error: (err) => console.error('Erreur lors du suppression :', err),
      });
    }

  }
  toggleSection(section: string) {
    switch (section) {
      case 'laboratoire':
        this.showLaboratoire = !this.showLaboratoire;
        break;
      case 'contacts':
        this.showContacts = !this.showContacts;
        break;
      case 'utilisateurs':
        this.showUtilisateurs = !this.showUtilisateurs;
        break;
    }
  }
}

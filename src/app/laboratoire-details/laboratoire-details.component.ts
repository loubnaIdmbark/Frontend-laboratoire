import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  withPreloading,
} from '@angular/router';
import {
  ContactLaboratoire,
  Laboratoire,
  LaboratoireService,
} from '../services/laboratoire.service';
import {
  utilisateur,
  UtilisateurService,
} from '../services/utilisateurs.service';
import { analyse, AnalyseService } from '../services/analyse.service';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { AuthService } from '../services/login.service';
import { testAnalyse } from '../services/testAnalyse.sevice';
import {epreuve, epreuveService} from '../services/epreuve.service';
import {PatientService,patient} from '../services/patient.service';
import {DossierService,dossier} from '../services/dossier.service';
import { forkJoin, map } from 'rxjs';
import {serviceExamin} from '../services/examin.service';

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
    RouterLink,
    NavbarComponent,
    NgChartsModule,
  ],
  standalone: true,
})
export class LaboratoireDetailsComponent implements OnInit {
  addUtilisateurForm: FormGroup;
  showModal = false;
  analyseId: number | null = null;
  epreuveForm: FormGroup;
  analyseForm: FormGroup;
  currentStep = 1;
  testAnalyseForm: FormGroup;
  username:string | null="null";
  isEditModalVisible2: boolean=false;
  editRoleForm: FormGroup;
  isAddUserModalVisible = false;
  showLaboratoire = true; // Affiché par défaut
  showContacts = false;
  showUtilisateurs = false;
  showAnalyses = false;
  showDossiers: boolean=false;
  showEpreuves = false;
  showExamins:boolean=false;
  examins:any;
  isAddExamenModalVisible:boolean=false;
  isAddPatientModalVisible:boolean=false;
  epreuves: epreuve[] = [];
  patients: patient[]=[];
  patient:any;
  analyses: any[] = [];
  showPatient: boolean = false;
  isModalVisible: boolean = false;
  contactForm: FormGroup;
  laboratoire: any;
  dossiersAvecPatients:any;
  analyse: any;
  utilisateur: any;
  contacts: ContactLaboratoire[] = [];
  editLaboratoireForm: FormGroup;
  isLoading: boolean = false; // Pour afficher un état de chargement
  errorMessage: string | null = null;
  isEditModalVisible: boolean = false;
  isEdiRoletModalVisible: boolean = false;
  laboratoires: Laboratoire[] = [];
  filteredLaboratoires: Laboratoire[] = [];
  public utilisateurChartData = {
    labels: ['techniciens', 'docteurs', 'patients'], // Ajoutez vos étiquettes ici
    datasets: [
      {
        label: 'Nom du dataset',
        data: [20, 10, 30], // Les données numériques
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Facultatif
        borderColor: 'rgba(75, 192, 192, 1)', // Facultatif
        borderWidth: 1, // Facultatif
      },
    ],
  };
  public anaid: number=0;
  public numDossier: number=0;

  public utilisateurChartType: ChartType = 'bar';
  public analyseChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr'], // Labels pour les axes
    datasets: [
      {
        data: [10, 20, 30, 40], // Les valeurs des barres
        label: 'Analyses', // Légende pour ce dataset
        borderColor: 'rgb(84,111,239)',
        backgroundColor: 'rgba(84,111,239,0.38)',
      },
    ],
  };



  toggleModal2() {
    this.showModal = !this.showModal;
    this.currentStep = 1;
  }
  closeModal() {
    this.showModal = false;
    this.analyseId = null;
    this.currentStep = 1; // Réinitialiser l'étape
  }
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }


  // Définir le type de graphique
  public analyseChartType: ChartType = 'bar';
  /////////////

  constructor(
    private fb: FormBuilder,
    private testAnalyse: testAnalyse,
    private PatientService:PatientService,
    private DossierService:DossierService,
    protected epreuveService:epreuveService,
    private serviceExamin:serviceExamin,
    private utilisateurService: UtilisateurService,
    private AnalyseService: AnalyseService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private laboratoireService: LaboratoireService,
    private UtilisateurService: UtilisateurService,
    private cdr: ChangeDetectorRef
  ) {
    this.contactForm = this.fb.group({
      numTel: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      fax: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
    this.editRoleForm = this.fb.group({
      email: ['', Validators.required], // Email de l'utilisateur
      role: ['', Validators.required], // Nouveau rôle
    });

    this.addUtilisateurForm = this.fb.group({
      nomComplet: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profession: ['', Validators.required],
      numTel: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      signature: [''],
      role: ['', Validators.required],
      fkIdLaboratoire: [null],
      password: [''],
    });this.analyseForm = this.fb.group({
      nom: [''],
      description: [''],
    });
    this.testAnalyseForm = this.fb.group({
      nomTest: [''],
      sousEpreuve: [''],
      epreuveId:[null],
      intervalMinDeReference: [null],
      intervalMaxDeReference: [null],
      uniteDeReference: [''],
    });this.epreuveForm = this.fb.group({
      nom: [''],

    });   this.editPatientForm = this.fb.group({
      idPatient: [{value: '', disabled: true}], // Champ désactivé pour l'ID
      nomComplet: ['', [Validators.required, Validators.minLength(3)]],
      dateNaissance: ['', [Validators.required]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      sexe: ['', [Validators.required]],
      numTel: ['', [ Validators.required,],],
      email: ['', [Validators.required, Validators.email,
      ],
      ],
    });
    this.editLaboratoireForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      nom: ['', [Validators.required, Validators.minLength(3)]],
      nrc: ['', [Validators.required]],
      logo: [null],
      dateActivation: ['', [Validators.required]],
      active: [false],
    });this.addPatientForm = this.fb.group({
      nomComplet: ['', [Validators.required]],
      dateNaissance: ['', [Validators.required]],
      lieuDeNaissance: ['', [Validators.required]],
      sexe: ['', [Validators.required]],
      numPieceIdentite: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      numTel: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      visiblePour: ['', [Validators.required]]
    });
  }

  toggleAddUserModal(): void {
    this.isAddUserModalVisible = !this.isAddUserModalVisible;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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
          console.error("Erreur lors de l'ajout de l'utilisateur", err);
          alert("Une erreur est survenue lors de l'ajout de l'utilisateur.");
        },
      });
    } else {
      alert('Veuillez remplir tous les champs requis correctement.');
    }
  }
  isSidebarCollapsed: boolean = false;
  activeMenu: string = '';
  editPatientForm:  FormGroup;
  addPatientForm:FormGroup;
  Dossiers: any;
  addExamenForm: any;


  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.route.params.subscribe((params) => {
      console.log('Paramètres de la route :', params);
      const id = +params['id'];
      if (id) {
        this.getLaboratoireDetails(id);
        this.getUtilisateur(id);
        this.getAnalyse(id);
        this.getPatientsByLaboratoire(id);
        this.chargerDossiersAvecPatients();
      } else {
        console.error('ID non trouvé dans les paramètres de la route.');
      }
    });
    this.loadContacts();
  }

  deleteUtilisateur(email: string, id: number): void {
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
  editUserRole(user: any): void {
    console.log('editUserRole called with:', user); // Debug log
    this.editRoleForm.patchValue({
      email: user
    });
    console.log('values:', this.editRoleForm.value);
    this.isEdiRoletModalVisible = true; // Affiche le modal
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
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // Convert the file to a Base64 string with the appropriate MIME type
        const base64String = e.target.result; // Already prefixed with data:image/...;base64,
        this.editLaboratoireForm.patchValue({ logo: base64String });
      };

      reader.readAsDataURL(file); // Read the file as a Data URL (Base64 encoded string)
    } else {
      console.warn('No file selected or input is empty.');
      this.editLaboratoireForm.patchValue({ logo: null });
    }
  }

  getUtilisateur(id: number): void {
    this.UtilisateurService.getUtilisateurs().subscribe(
      (utilisateurs) => {
        this.utilisateur = utilisateurs.filter(
          (user) => user.fkIdLaboratoire === id
        );
        console.log('les utilisateurs sont :', utilisateurs);
      },

      (error) => {
        console.error('Erreur lors du chargement des utilisateurs :', error);
      }
    );
  }

  getAnalyse(id: number): void {
    this.AnalyseService.getAnalyses().subscribe(
      (analyse) => {
        // Filtrage des utilisateurs par fkIdLaboratoire
        this.analyse = analyse.filter(
          (analyse) => analyse.fkIdLaboratoire === id
        );
        console.log('les analyses sont :', analyse);
      },

      (error) => {
        console.error('Erreur lors du chargement des analyses :', error);
      }
    );
  }

  onEditLaboratoireSubmit(id: number): void {
    if (this.editLaboratoireForm.valid) {
      // Extract the form values
      const rawValues = this.editLaboratoireForm.getRawValue();

      // Convert the form values into a JSON object
      const payload: any = { ...rawValues };

      // Handle the file separately, convert it to Base64 (if applicable)
      if (payload.logo instanceof File) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          payload.logo = event.target.result.split(',')[1]; // Extract the Base64 string

          // Send the JSON payload
          this.laboratoireService.updateLaboratoroire(id, payload).subscribe({
            next: () => {
              this.isEditModalVisible = false;
              this.getLaboratoireDetails(id);
            },
            error: (err) => {
              console.error(
                'Erreur lors de la modification du laboratoire :',
                err
              );
              alert('Une erreur est survenue lors de la modification.');
            },
          });
        };
        reader.readAsDataURL(payload.logo); // Read the file as Base64
      } else {
        // If no file, send the JSON payload directly
        this.laboratoireService.updateLaboratoroire(id, payload).subscribe({
          next: () => {
            this.isEditModalVisible = false;
            this.getLaboratoireDetails(id);
          },
          error: (err) => {
            console.error(
              'Erreur lors de la modification du laboratoire :',
              err
            );
            alert('Une erreur est survenue lors de la modification.');
          },
        });
      }
    }
  }

  DesActiverLaboratoire(id: number): void {
    this.laboratoireService.getLaboratoireById(id).subscribe({
      next: (laboratoire: Laboratoire) => {
        if (laboratoire) {
          // Modify the 'active' attribute
          laboratoire.active = false;

          // Prepare the payload
          const payload: any = { ...laboratoire };

          // Handle the logo file if it exists
          if (payload.logo instanceof File) {
            const reader = new FileReader();
            reader.onload = (event: any) => {
              // Convert the logo to Base64 and update the payload
              payload.logo = event.target.result.split(',')[1];

              // Send the JSON payload with the Base64 string
              this.sendDesactivateRequest(id, payload);
            };
            reader.readAsDataURL(payload.logo); // Read the file as Base64
          } else {
            // If no file, send the JSON payload directly
            this.sendDesactivateRequest(id, payload);
          }
        }
      },
      error: (err) => {
        console.error(
          `Erreur lors de la récupération du laboratoire ${id} :`,
          err
        );
      },
    });
  }

  private sendDesactivateRequest(id: number, payload: any): void {
    this.laboratoireService.updateLaboratoroire(id, payload).subscribe({
      next: () => {
        alert('Laboratoire désactivé avec succès.');
        console.log(`Laboratoire ${id} désactivé avec succès.`);
        this.laboratoires = this.laboratoires.filter((labo) => labo.id !== id);
        this.filteredLaboratoires = [...this.laboratoires];
        this.router
          .navigate(['/laboratoire'])
          .then(() => console.log('Redirection réussie'));
      },
      error: (err) => {
        console.error(
          `Erreur lors de la désactivation du laboratoire ${id} :`,
          err
        );
        alert(
          'Une erreur est survenue lors de la désactivation du laboratoire.'
        );
      },
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
  onSubmit(labId: number, adresseId: number): void {
    const contact = this.contactForm.value;

    const contactWithFk = {
      ...contact,
      laboratoire: { id: labId },
      adresse: { id: adresseId },
    };
    console.log(contactWithFk);
    this.laboratoireService.addContactLaboratoire(contactWithFk).subscribe({
      next: () => {
        this.toggleModal();
        this.getLaboratoireDetails(labId);
        alert('Contact ajouté avec succès !');
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout du contact :', err);
        alert('Erreur lors de l’ajout du contact.');
      },
    });
  }

  onEditRoleSubmit(): void {
    console.log('Formulaire soumis :', this.editRoleForm.value);
    if (this.editRoleForm.valid) {
      const { email, role } = this.editRoleForm.value;

      if (!email || !role) {
        alert('Veuillez fournir un email et sélectionner un rôle.');
        return;
      }

      console.log('Formulaire soumis avec :', { email, role });

      // Fetch user by email
      this.utilisateurService.getUtilisateurByEmail(email).subscribe({
        next: (user: any) => {
          user.role = role;
          // Update user with new role
          this.utilisateurService.updateUtilisateur(email, user).subscribe({
            next: () => {
              console.log('Utilisateur mis à jour avec succès', user);
              alert(`Le rôle de ${email} a été mis à jour en ${role}.`);
              this.isEdiRoletModalVisible = false;
            },
            error: (err) => {
              console.error(
                "Erreur lors de la mise à jour de l'utilisateur :",
                err
              );
              alert('Une erreur est survenue lors de la mise à jour.');
            },
          });
        },
        error: (err) => {
          console.error(
            "Erreur lors de la récupération de l'utilisateur :",
            err
          );
          alert("Utilisateur introuvable. Veuillez vérifier l'email.");
        },
      });
    } else {
      alert('Veuillez sélectionner un rôle valide.');
    }
  }

  getLaboratoireDetails(id: number): void {
    this.laboratoireService.getLaboratoireById(id).subscribe({
      next: (response) => {
        console.log('Détails du laboratoire :', response);
        this.laboratoire = response;
      },
      error: (err) => {
        console.error(
          'Erreur lors de la récupération des détails du laboratoire :',
          err
        );
      },
    });
  }
  getLaboratoireContacts(laboratoireId: number): void {
    this.laboratoireService.getContact().subscribe({
      next: (contacts) => {
        const filteredContacts = contacts.filter(
          (contact) => contact.fkIdLaboratoire === laboratoireId
        );
        this.contacts = filteredContacts.slice(0, 50); // Limiter à 50 contacts
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des contacts :', err);
      },
    });
  }

  deleteContact(id: number): void {
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


  submitAnalyse(laboratoireId: number) {
    const analyseData = this.analyseForm.value;
    analyseData.fkIdLaboratoire = laboratoireId;

    this.AnalyseService.addanalyse(analyseData).subscribe((response) => {
      console.log('Analyse ajoutée :', response);
      this.anaid = response.id;
      this.currentStep = 2; // Passer à l'étape 2
    });
  }

  openModalForEpreuve(): void {
    this.currentStep = 2;

    console.log(this.anaid)
    this.showModal = true;
    this.epreuveForm.reset();
    this.testAnalyseForm.reset(); // Réinitialiser le formulaire du test analyse
  }

  submitEpreuveEtTestAnalyse(): void {
    const testAnalyseData = {
      ...this.testAnalyseForm.value,
    };
    console.log(this.anaid)
    this.testAnalyse.addtestdanalyse(testAnalyseData).subscribe(
      (testAnalyseResponse) => {
        console.log('Test Analyse ajouté :', testAnalyseResponse);
        const testAnalyseId = testAnalyseResponse.id;

        const epreuveData = {
          ...this.epreuveForm.value,
          analyse: {
            id: this.anaid, // Associer l'analyse existante
          },
          testAnalyse: {
            id: testAnalyseId,
          },
        };

        this.epreuveService.addepreuve(epreuveData).subscribe(
          (epreuveResponse) => {
            console.log('Épreuve ajoutée :', epreuveResponse);
            this.closeModal(); // Fermer la modal après avoir ajouté l'épreuve
          },
          (epreuveError) => {
            console.error('Erreur lors de l\'ajout de l\'épreuve :', epreuveError);
          }
        );
      },
      (testAnalyseError) => {
        console.error('Erreur lors de l\'ajout du Test Analyse :', testAnalyseError);
      }
    );

  }



  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  navigateToEpreuveDetails(id: number): void {
    console.log('Naviguer vers les détails de l\'épreuve:', id);
    this.anaid=id;
    this.showAnalyses = false;
    this.showEpreuves=true;
    this.epreuveService.getAllEpreuvesByIdAnalyse(id).subscribe(
      (data) => {
        console.log('Toutes les épreuves reçues du backend :', data);
        this.epreuves = data; // Pas de filtre supplémentaire
        console.log('Épreuves associées à l\'analyse :', this.epreuves);

        if (this.epreuves.length === 0) {
          console.warn('Aucune épreuve trouvée pour l\'analyse avec ID :', id);
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des épreuves :', error);
      }
    );


  }

  deleteAnalyse(id:number):void{
    if (confirm('Êtes-vous sûr de vouloir supprimer cet analyse ?')) {
      this.AnalyseService.deteleanalyse(id).subscribe({
        next: () => {
          alert('analyse supprimé avec succès.');

     this.showAnalyses=true;
        },

        error: (err) => console.error('Erreur lors du suppression :', err),
      });
    }

  }

  getPatientsByLaboratoire(fkIdLaboratoire: number): void {
    this.PatientService.getAllPatients().subscribe({
      next: (response: patient[]) => {
        console.log('Tous les patients récupérés :', response);


        this.patients = response.filter(patient => patient.fkIdLaboratoire === fkIdLaboratoire);

        console.log('Patients associés au laboratoire :', this.patients);
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des patients :', err);
      },
    });
  }


  toggleSection(section: string) {
    switch (section) {
      case 'laboratoire':
        this.showLaboratoire = true;
        this.showAnalyses = false;
        this.showUtilisateurs = false;
        this.showContacts = false;
        this.showPatient = false;
        this.showEpreuves = false;
        this.showExamins=false;
        break;
      case 'contacts':
        this.showContacts = true;
        this.showAnalyses = false;
        this.showUtilisateurs = false;
        this.showLaboratoire = false;
        this.showPatient = false;
        this.showEpreuves = false;
        this.showDossiers=false;
        break;
      case 'utilisateurs':
        this.showUtilisateurs = true;
        this.showAnalyses = false;
        this.showContacts = false;
        this.showLaboratoire = false;
        this.showPatient = false;
        this.showEpreuves = false;
        this.showDossiers=false;
        this.showExamins=false;
        break;
      case 'analyses':
        this.showAnalyses = true;
        this.showUtilisateurs = false;
        this.showContacts = false;
        this.showLaboratoire = false;
        this.showPatient = false;
        this.showEpreuves = false;
        this.showDossiers=false;
        this.showExamins=false;
        break;
      case 'patients':
        this.showPatient = true;
        this.showAnalyses = false;
        this.showUtilisateurs = false;
        this.showContacts = false;
        this.showLaboratoire = false;
        this.showEpreuves = false;
        this.showDossiers=false;
        this.showExamins=false;
        break;
       case 'dossiers':
         this.showDossiers=true;
         this.showPatient = false;
         this.showAnalyses = false;
         this.showUtilisateurs = false;
         this.showContacts = false;
         this.showLaboratoire = false;
         this.showEpreuves = false;
         this.showExamins=false;
    }
  }

  deletePatient(idPatient: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet analyse ?')) {
      this.PatientService.deletePatient(idPatient).subscribe({
        next: () => {
          alert('Analyse supprimée avec succès.');

        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l’analyse:', err);
          alert('Une erreur s’est produite lors de la suppression.');
        }
      });
    }
  }


  updatePatient(idPatient: number) {

    // Afficher le modal
    this.isEditModalVisible2 = true;

    this.PatientService.getPatient(idPatient).subscribe({
      next: (response) => {
        console.log('Détails du patient :', response);
        this.patient = response;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des détails du laboratoire :', err);
      },
    });
    // Pré-remplir les champs du formulaire avec les données actuelles
    this.editPatientForm.patchValue({
      idPatient: this.patient.idPatient,
      nomComplet: this.patient.nomComplet,
      dateNaissance: this.patient.dateNaissance,
      adresse: this.patient.adresse,
      sexe: this.patient.sexe,
      telephone: this.patient.numTel,
      email: this.patient.email,
    });

    // Récupérer les nouvelles valeurs du formulaire
    const updatedPatient = this.editPatientForm.getRawValue();

    // Créer un objet FormData pour envoyer les données
    const formData = new FormData();

    formData.append('nomComplet', updatedPatient.nomComplet);
    formData.append('dateNaissance', updatedPatient.dateNaissance);
    formData.append('adresse', updatedPatient.adresse);
    formData.append('sexe', updatedPatient.sexe);
    formData.append('numTel', updatedPatient.numTel);
    formData.append('email', updatedPatient.email);

    // Afficher les données dans la console pour vérification
    console.log('Patient mis à jour :', updatedPatient);
    console.log('FormData envoyé :', formData);

    // Appel du service pour mettre à jour le patient
    this.PatientService.updatePatient(idPatient, formData).subscribe({
      next: (response) => {
        console.log('Patient mis à jour avec succès !', response);
        this.isEditModalVisible = false;
        this.PatientService.getPatient(idPatient);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du patient :', err);
      },
    });
  }

  ouvrirDossier() {

  }

  navigateToExamin(numDossier:number) {
this.showExamins=true;
    this.showDossiers=false;
    this.numDossier=numDossier;
  }


  onAddPatientSubmit(idlaboratoire:number) {


    const patientData: patient = {
      fkIdLaboratoire:idlaboratoire,
      ...this.addPatientForm.value,
    };

    this.PatientService.addPatient(patientData).subscribe({
      next: (response) => {
        console.log('Patient ajouté avec succès', response);


        const newPatientId = response.idPatient;


        const dossierData = {
          fkIdPatient: response.idPatient,
          fkEmailUtilisateur: this.username,
          date: new Date().toISOString().split('T')[0], // Exemple de date
        };
        this.DossierService.addDossier(dossierData).subscribe({
          next: (dossierResponse) => {
            console.log('Dossier créé avec succès :', dossierResponse);
          },
          error: (err) => {
            console.error('Erreur lors de la création du dossier :', err);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout du patient :', err);
      }
    });
  }
  toggleModalDossier() {
    this.isAddPatientModalVisible = !this.isAddPatientModalVisible;
  }
  chargerDossiersAvecPatients(): void {
    this.DossierService.getDossiers().subscribe((dossiers: dossier[]) => {
      // Filtrer les dossiers par fkEmailUtilisateur
      const dossiersFiltres = dossiers.filter((dossier) => dossier.fkEmailUtilisateur === this.username);

      // Mapper les dossiers filtrés avec les requêtes pour obtenir les patients
      const requetesPatients = dossiersFiltres.map((dossier) =>
        this.PatientService.getPatient(dossier.fkIdPatient).pipe(
          map((patient: patient) => ({
            ...dossier,
            nomPatient: patient.nomComplet,
          }))
        )
      );

      // Attendre la fin de toutes les requêtes
      forkJoin(requetesPatients).subscribe((resultats) => {
        this.dossiersAvecPatients = resultats; // Dossiers enrichis avec les noms des patients
        this.Dossiers = [...resultats]; // Initialiser les dossiers filtrés pour un usage futur
      });
    });
  }
  toggleModalExamen(laboratoireId: number) {
    this.isAddExamenModalVisible = true;

    // Réinitialisation des données
    this.analyses = [];
    this.epreuves = [];

    // Récupération et filtrage des analyses par laboratoire
    this.AnalyseService.getAnalyses().subscribe({
      next: (analyses) => {
        const filteredAnalyses = analyses.filter(
          (analyse) => analyse.fkIdLaboratoire === laboratoireId
        );

        if (filteredAnalyses.length === 0) {
          alert('Aucune analyse trouvée pour ce laboratoire.');
          this.isAddExamenModalVisible = false; // Fermer le modal si aucune analyse trouvée
          return;
        }

        console.log('Les analyses filtrées sont :', filteredAnalyses);
        this.analyses = filteredAnalyses; // Stocker les analyses filtrées

        // Récupérer toutes les épreuves pour les analyses filtrées
        this.loadEpreuvesForAnalyses(filteredAnalyses);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des analyses :', err);
        alert('Une erreur est survenue lors du chargement des analyses.');
        this.isAddExamenModalVisible = false; // Fermer le modal en cas d'erreur
      },
    });
  }

// Fonction pour récupérer les épreuves associées à toutes les analyses filtrées
  private loadEpreuvesForAnalyses(analyses: any[]) {
    const epreuveRequests = analyses.map((analyse) =>
      this.epreuveService.getAllEpreuvesByIdAnalyse(analyse.id)
    );

    // Exécuter toutes les requêtes en parallèle et combiner les résultats
    forkJoin(epreuveRequests).subscribe({
      next: (allEpreuves) => {
        // `allEpreuves` est un tableau de tableaux d'épreuves
        this.epreuves = allEpreuves.flat(); // Fusionner tous les tableaux en un seul
        console.log('Toutes les épreuves récupérées :', this.epreuves);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des épreuves :', err);
        alert('Une erreur est survenue lors de la récupération des épreuves.');
      },
    });
  }

  onAddExamenSubmit() {
    if (this.addExamenForm.invalid) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    const { fkIdEpreuve, fkIdTestAnalyse, resultat } = this.addExamenForm.value;

    // Vérification si les analyses et les épreuves ont été récupérées
    if (!this.analyses || !this.epreuves) {
      alert('Les données nécessaires n\'ont pas été chargées. Veuillez réessayer.');
      return;
    }

    // Vérification de l'épreuve sélectionnée
    const selectedEpreuve = this.epreuves.find((e) => e.id === fkIdEpreuve);
    if (!selectedEpreuve) {
      alert('Épreuve introuvable pour cette analyse.');
      return;
    }

    // Trouver l'analyse associée à l'épreuve sélectionnée
    const selectedAnalyse = this.analyses.find((a) => a.id === selectedEpreuve.fkIdAnalyse);
    if (!selectedAnalyse) {
      alert('Analyse introuvable pour l\'épreuve sélectionnée.');
      return;
    }

    // Construire l'objet pour l'examen avec l'ID de l'analyse et de l'épreuve
    const examen = {
      fkIdEpreuve: selectedEpreuve.id,   // ID de l'épreuve sélectionnée
      fkIdAnalyse: selectedAnalyse.id,  // ID de l'analyse associée
      resultat,                         // Résultat saisi dans le formulaire
      fkIdTestAnalyse: selectedEpreuve.testAnalyse?.id,              // Autre champ provenant du formulaire
     fkNumDossier:this.numDossier,
    };

    // Appel du service pour soumettre l'examen
    this.serviceExamin.addExamin(examen).subscribe({
      next: () => {
        alert('Examen ajouté avec succès !');
        this.toggleModalExamen(-1); // Fermer le modal après ajout
        this.addExamenForm.reset();
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de l\'examen :', err);
        alert('Une erreur est survenue. Veuillez réessayer.');
      },
    });
  }

}

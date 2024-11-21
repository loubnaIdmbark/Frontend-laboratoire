import { Component, OnInit } from '@angular/core';
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

  isLoading: boolean = false; // Pour afficher un état de chargement
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private laboratoireService: LaboratoireService
  ) {this.contactForm = this.fb.group({
    numTel: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    fax: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],

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
  //à faire ///////////////////
  updateLaboratoroire(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir archiver ce laboratoire ?')) {
      this.laboratoireService.updateLaboratoroire(id,this.laboratoire).subscribe({
        next: () => {
          alert('Laboratoire mofidié avec succès.');

        },
        error: (err) => console.error('Erreur lors de l’archivage :', err),
      });
    }
  }


  loadContacts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.getLaboratoireContacts(this.laboratoire.id);
  }

  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible;
    console.log('Modal visibility:', this.isModalVisible);
    if (!this.isModalVisible) {
      this.resetForms();
    }
  }
  resetForms(): void {
    this.contactForm.reset();

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

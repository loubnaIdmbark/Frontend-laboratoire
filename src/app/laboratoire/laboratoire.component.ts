import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { LaboratoireService, Laboratoire, ContactLaboratoire, AdresseLaboratoire } from './laboratoire.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-laboratoire',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule],
  templateUrl: './laboratoire.component.html',
  styleUrls: ['./laboratoire.component.css']
})
export class LaboratoireComponent {
  step = 1;
  showAddForm = false;
  // Groupes de formulaires
  laboratoireForm: FormGroup;
  contactForm: FormGroup;
  adresseForm: FormGroup;

  laboratoires: Laboratoire[] = [];
  checkboxVisible = true;

  constructor(private laboratoireService: LaboratoireService, private fb: FormBuilder) {
    // Initialise les formulaires
    this.laboratoireForm = this.fb.group({
      nom: ['', Validators.required],
      logo: [null],
      nrc: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      active: [false],
      dateActivation: ['', Validators.required]
    });

    this.contactForm = this.fb.group({
      numTel: ['', Validators.required],
      fax: [''],
      email: ['', [Validators.required, Validators.email]]
    });

    this.adresseForm = this.fb.group({
      numVoie: ['', Validators.required],
      nomVoie: ['', Validators.required],
      codePostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      ville: ['', Validators.required],
      commune: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.chargerLaboratoires();
  }

  nextStep() {
    if (this.step < 3) this.step++;
  }

  previousStep() {
    if (this.step > 1) this.step--;
  }

  onSubmit() {
    // Vérifiez si tous les formulaires sont valides avant de soumettre
    if (this.laboratoireForm.valid && this.contactForm.valid && this.adresseForm.valid) {
      const laboratoireData = this.laboratoireForm.value;
      const adresseData: AdresseLaboratoire = this.adresseForm.value;

      this.laboratoireService.addLaboratoire(laboratoireData).subscribe(
        (laboratoireResponse) => {
          const laboratoireId = laboratoireResponse.id;

          this.laboratoireService.addAdresseLaboratoire(adresseData).subscribe(
            (adresseResponse) => {
              const adresseId = adresseResponse.id;

              const contactData: ContactLaboratoire = {
                ...this.contactForm.value,
                laboratoireId: laboratoireId,
                adresseId: adresseId,
              };

              this.laboratoireService.addContactLaboratoire(contactData).subscribe(
                () => {
                  alert("Formulaire complet enregistré avec succès !");
                  this.chargerLaboratoires(); // Recharge les laboratoires
                },
                (error) => {
                  console.error("Erreur lors de l'ajout du contact:", error);
                  alert("Une erreur s'est produite lors de l'ajout du contact.");
                }
              );
            },
            (error) => {
              console.error("Erreur lors de l'ajout de l'adresse:", error);
              alert("Une erreur s'est produite lors de l'ajout de l'adresse.");
            }
          );
        },
        (error) => {
          console.error("Erreur lors de l'ajout du laboratoire:", error);
          alert("Une erreur s'est produite lors de l'ajout du laboratoire.");
        }
      );
    } else {
      alert("Veuillez remplir tous les champs requis.");
    }
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const byteArray = new Uint8Array(reader.result as ArrayBuffer);
        this.laboratoireForm.patchValue({ logo: byteArray });
      };
      reader.readAsArrayBuffer(file);
    }
  }

  chargerLaboratoires(): void {
    this.laboratoireService.getLaboratoire().subscribe(
      (data) => {
        this.laboratoires = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des laboratoires:', error);
      }
    );
  }

  // Méthode pour afficher ou masquer le formulaire d'ajout
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }
  modifierLaboratoire(laboratoire: Laboratoire): void {
    console.log('Modifier le laboratoire:', laboratoire);
    // Logique pour modifier le laboratoire (ouvrir un formulaire, etc.)
  }

  archiverLaboratoire(id: number): void {
    this.laboratoireService.deleteLaboratory(id).subscribe(
      () => {
        console.log('Laboratoire archivé avec succès');
        alert('Laboratoire supprimé avec succès');
        this.chargerLaboratoires();
      },
      (error) => {
        console.error('Erreur lors de la suppression du laboratoire:', error);
        alert('Une erreur est survenue lors de la suppression.');
      }
    );
  }
}

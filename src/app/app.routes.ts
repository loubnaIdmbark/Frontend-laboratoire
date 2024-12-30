import { Routes } from '@angular/router';
import { LaboratoireComponent } from './laboratoire/laboratoire.component';
import { AccueilComponent } from './accueil/accueil.component';
import { LoginComponent } from './login/login.component';
import { LaboratoireDetailsComponent } from './laboratoire-details/laboratoire-details.component';
import { LaboratoiresNonActivesComponent } from './laboratoires-non-actives/laboratoires-non-actives.component';
import { DossierComponent } from './dossier/dossier.component';
import { ProfileComponent } from './profile/profile.component';
import { PatientComponent } from './patient/patient.component';
import { ConsultationComponent } from './consultation/consultation.component';
import { ConsultationInfoComponent } from './consultation-info/consultation-info.component';

export const appRoutes: Routes = [
  { path : 'consultation-info/:codeDossier', component: ConsultationInfoComponent },
  { path: 'consultation', component: ConsultationComponent },
  { path: 'laboratoire', component: LaboratoireComponent },
  { path: 'patient/:fkIdPatient', component: PatientComponent },
  { path: 'NonActifs', component: LaboratoiresNonActivesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'dossier', component: DossierComponent },
  { path: 'details/:id', component: LaboratoireDetailsComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:mode', component: LoginComponent },
  { path: 'laboratoire', component: LaboratoireComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirection par défaut vers /login
  { path: '**', redirectTo: '/login' }, // Route wildcard pour les URL non trouvées
];

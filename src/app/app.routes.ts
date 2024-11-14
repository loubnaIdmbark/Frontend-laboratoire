import { Routes } from '@angular/router';
import {LaboratoireComponent} from './laboratoire/laboratoire.component';
import {AccueilComponent} from './accueil/accueil.component';

const routes: Routes = [

  { path: 'laboratoire', component: LaboratoireComponent},
  { path: 'accueil', component: AccueilComponent},
  { path: 'home', component: HomeComponent },
  { path: 'laboratoires', component: LaboratoiresComponent },
  { path: 'utilisateurs', component: UtilisateursComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'analyses', component: AnalysesComponent },
  { path: 'parametres', component: ParametresComponent },
  { path: 'aide', component: AideComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { LoginComponent } from './login/login.component';
import { LaboratoireComponent } from './laboratoire/laboratoire.component';
import { LaboratoireDetailsComponent} from './laboratoire-details/laboratoire-details.component';
import {LaboratoiresNonActivesComponent} from './laboratoires-non-actives/laboratoires-non-actives.component'
import {AppComponent} from './app.component';
import { ProfileComponent} from './profile/profile.component'
const routes: Routes = [
  { path: 'details/:id', component: LaboratoireDetailsComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'NonActifs', component: LaboratoiresNonActivesComponent },
  { path: 'profile', component: ProfileComponent },

  { path: 'laboratoire', component: LaboratoireComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: '**', redirectTo: '/accueil' }, // Route wildcard pour les URL non trouvées
];

@NgModule({

  imports: [RouterModule.forRoot(routes), LaboratoireDetailsComponent, AppComponent,LaboratoireComponent],
  exports: [RouterModule]
})
export class AppRoutingModule {}

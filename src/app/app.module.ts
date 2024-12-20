import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AccueilComponent } from './accueil/accueil.component';
import { LaboratoireComponent } from './laboratoire/laboratoire.component';
import { LaboratoiresNonActivesComponent } from './laboratoires-non-actives/laboratoires-non-actives.component';
import { LaboratoireDetailsComponent} from  './laboratoire-details/laboratoire-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileComponent} from './profile/profile.component'
import { NgChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccueilComponent,LaboratoireComponent,
    LaboratoireDetailsComponent,
    LaboratoiresNonActivesComponent
  ],
    imports: [
      NgChartsModule,
        BrowserModule,
      ReactiveFormsModule,
        AppRoutingModule,
      LaboratoireDetailsComponent,
      CommonModule, // Pipe 'date'
      FormsModule, // Formulaires basés sur template
      LaboratoiresNonActivesComponent,
      ProfileComponent
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

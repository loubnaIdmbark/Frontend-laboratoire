import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AccueilComponent } from './accueil/accueil.component';
import { LaboratoireComponent } from './laboratoire/laboratoire.component';
import { LaboratoiresNonActivesComponent } from './laboratoires-non-actives/laboratoires-non-actives.component';
import { LaboratoireDetailsComponent } from './laboratoire-details/laboratoire-details.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts'; // Ensure compatibility with Angular version
import { AuthService } from './services/login.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccueilComponent,
    LaboratoireComponent,
    LaboratoireDetailsComponent,
    LaboratoiresNonActivesComponent,
    ProfileComponent, // Ensure this is correctly imported
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule, // For charts if required globally
    HttpClientModule, // For HTTP requests
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

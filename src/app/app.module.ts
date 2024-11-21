import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AccueilComponent } from './accueil/accueil.component';
import { LaboratoireComponent } from './laboratoire/laboratoire.component';
import { LaboratoireDetailsComponent} from  './laboratoire-details/laboratoire-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccueilComponent,LaboratoireComponent,
    LaboratoireDetailsComponent
  ],
    imports: [
        BrowserModule,
      ReactiveFormsModule,
        AppRoutingModule,
      LaboratoireDetailsComponent,
      CommonModule, // Pipe 'date'
      FormsModule, // Formulaires basés sur template

    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

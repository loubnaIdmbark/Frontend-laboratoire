import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AccueilComponent } from './accueil/accueil.component';
import { LaboratoireComponent } from './laboratoire/laboratoire.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccueilComponent,LaboratoireComponent,

  ],
    imports: [
        BrowserModule,
      ReactiveFormsModule,
        AppRoutingModule,

      CommonModule, // Pipe 'date'
      FormsModule, // Formulaires basés sur template

    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

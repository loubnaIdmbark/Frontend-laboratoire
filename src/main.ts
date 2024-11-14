// @ts-ignore
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { LaboratoireComponent } from './app/laboratoire/laboratoire.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AccueilComponent } from './app/accueil/accueil.component';
bootstrapApplication(AccueilComponent, {
  providers: [provideHttpClient(), provideAnimationsAsync()],
})
  .catch(err => console.error(err));

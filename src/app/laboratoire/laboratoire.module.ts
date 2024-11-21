import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LaboratoireComponent } from './laboratoire.component';
import { LaboratoireDetailsComponent} from '../laboratoire-details/laboratoire-details.component';

@NgModule({
  declarations: [],
  imports: [ CommonModule, ReactiveFormsModule, LaboratoireComponent,LaboratoireDetailsComponent],
  exports: [LaboratoireComponent]
})
export class LaboratoireModule {}

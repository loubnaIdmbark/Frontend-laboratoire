import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LaboratoireComponent } from './laboratoire.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, ReactiveFormsModule, LaboratoireComponent],
  exports: [LaboratoireComponent]
})
export class LaboratoireModule {}

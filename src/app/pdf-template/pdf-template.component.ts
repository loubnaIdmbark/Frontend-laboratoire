import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-template',
  templateUrl: './pdf-template.component.html',
  styleUrls: ['./pdf-template.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class PdfTemplateComponent {
  @Input() dossier: any;
  @Input() selectedExamins: any[] = [];
}

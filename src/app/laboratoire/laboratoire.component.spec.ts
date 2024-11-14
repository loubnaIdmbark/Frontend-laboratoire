import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LaboratoireComponent } from './laboratoire.component';

describe('LaboratoireComponent', () => {
  let component: LaboratoireComponent;
  let fixture: ComponentFixture<LaboratoireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LaboratoireComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LaboratoireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form', () => {
    // Assurez-vous que `laboratoireForm` est le bon nom pour votre formulaire
    component.laboratoireForm.controls['nom'].setValue('Laboratoire Test');
    component.laboratoireForm.controls['nrc'].setValue('123456');
    component.laboratoireForm.controls['active'].setValue(true);
    component.laboratoireForm.controls['dateActivation'].setValue(new Date());

    expect(component.laboratoireForm.valid).toBeTrue();
  });
});

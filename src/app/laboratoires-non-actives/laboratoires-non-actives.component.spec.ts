import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoiresNonActivesComponent } from './laboratoires-non-actives.component';

describe('LaboratoiresNonActivesComponent', () => {
  let component: LaboratoiresNonActivesComponent;
  let fixture: ComponentFixture<LaboratoiresNonActivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratoiresNonActivesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboratoiresNonActivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

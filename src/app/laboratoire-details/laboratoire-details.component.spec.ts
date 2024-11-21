import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoireDetailsComponent } from './laboratoire-details.component';

describe('LaboratoireDetailsComponent', () => {
  let component: LaboratoireDetailsComponent;
  let fixture: ComponentFixture<LaboratoireDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratoireDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboratoireDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

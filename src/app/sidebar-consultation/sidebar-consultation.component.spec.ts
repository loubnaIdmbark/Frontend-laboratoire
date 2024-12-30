import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarConsultationComponent } from './sidebar-consultation.component';

describe('SidebarConsultationComponent', () => {
  let component: SidebarConsultationComponent;
  let fixture: ComponentFixture<SidebarConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarConsultationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

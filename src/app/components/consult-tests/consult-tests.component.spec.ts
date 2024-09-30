import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultTestsComponent } from './consult-tests.component';

describe('ConsultTestsComponent', () => {
  let component: ConsultTestsComponent;
  let fixture: ComponentFixture<ConsultTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultTestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

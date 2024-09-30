import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassedTestsComponent } from './passed-tests.component';

describe('PassedTestsComponent', () => {
  let component: PassedTestsComponent;
  let fixture: ComponentFixture<PassedTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassedTestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassedTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

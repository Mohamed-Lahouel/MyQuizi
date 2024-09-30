import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTestComponent } from './report-test.component';

describe('ReportTestComponent', () => {
  let component: ReportTestComponent;
  let fixture: ComponentFixture<ReportTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoicesOverviewComponent } from './choices-overview.component';

describe('ChoicesOverviewComponent', () => {
  let component: ChoicesOverviewComponent;
  let fixture: ComponentFixture<ChoicesOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoicesOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoicesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

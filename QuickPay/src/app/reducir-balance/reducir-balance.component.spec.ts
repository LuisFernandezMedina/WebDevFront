import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReducirBalanceComponent } from './reducir-balance.component';

describe('ReducirBalanceComponent', () => {
  let component: ReducirBalanceComponent;
  let fixture: ComponentFixture<ReducirBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReducirBalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReducirBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnadirBalanceComponent } from './anadir-balance.component';

describe('AnadirBalanceComponent', () => {
  let component: AnadirBalanceComponent;
  let fixture: ComponentFixture<AnadirBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnadirBalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnadirBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

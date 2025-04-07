import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BizumComponent } from './bizum.component';

describe('BizumComponent', () => {
  let component: BizumComponent;
  let fixture: ComponentFixture<BizumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BizumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BizumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

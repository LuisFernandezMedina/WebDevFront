import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAdminsComponent } from './lista-admins.component';

describe('ListaAdminsComponent', () => {
  let component: ListaAdminsComponent;
  let fixture: ComponentFixture<ListaAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAdminsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

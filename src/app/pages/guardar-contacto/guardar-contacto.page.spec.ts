import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuardarContactoPage } from './guardar-contacto.page';

describe('GuardarContactoPage', () => {
  let component: GuardarContactoPage;
  let fixture: ComponentFixture<GuardarContactoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarContactoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

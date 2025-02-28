import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FooterComponent, HeaderComponent]

})
export class LoginComponent {
  username: string = '';
  password: string = '';
  passwordVisible = false;
  emailInvalid = false;
  loginFailed = false;
  isLoading = false;
  twoFactorEnabled = false;

  passwordInvalid = false;
  domainInvalid = false;
  errorMessage: string = '';
  @ViewChild('loginForm') loginForm!: NgForm;
  
  private readonly emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly injectionPattern: RegExp = /(\r|\n|%0a|%0d|%0A|%0D)/;
  private readonly minPasswordLength: number = 8;
  private readonly blacklistDomains: string[] =  [
    'mailinator.com',
    '10minutemail.com',
    'guerrillamail.com',
    'yopmail.com',
    'getnada.com',
    'temp-mail.org',
    'dispostable.com',
    'trashmail.com',
    'fakeinbox.com',
    'tempmailaddress.com'
  ];
  constructor() { }
  ngOnInit(): void {
  }

   // Método de inicio de sesión que llama al servicio `UserService`
  loginAttempt(): void {
    this.resetValidationStates();
    this.onEmailChange();
    this.validatePassword();
  
    if (!this.emailInvalid && !this.passwordInvalid && !this.domainInvalid) {
      const user = {
        email: this.username,
        pwd: this.password,
      };
  
    } else {
      this.loginFailed = true;
    }
  }

  // Validar que el correo electrónico ingresado tenga un formato válido cada vez que cambie
  onEmailChange(): void {
    this.resetEmailValidationStates(); // Restablecer estados de validación de email al cambiar
    if (this.username.trim() === '') {
      this.emailInvalid = false;
      return;
    }

    // Validar el formato del correo electrónico
    if (!this.emailPattern.test(this.username)) {
      this.emailInvalid = true;
      this.errorMessage = 'El correo electrónico no tiene un formato válido.';
      return;
    }

    // Validar si el correo contiene caracteres de inyección
    if (this.injectionPattern.test(this.username)) {
      this.emailInvalid = true;
      this.errorMessage = 'El correo electrónico contiene caracteres maliciosos.';
      return;
    }

    // Validar la longitud máxima del correo (320 caracteres)
    if (this.username.length > 320) {
      this.emailInvalid = true;
      this.errorMessage = 'El correo electrónico es demasiado largo.';
      return;
    }

    // Validar si el dominio del correo está en la lista negra
    const domain = this.username.split('@')[1];
    if (domain && this.blacklistDomains.includes(domain)) {
      this.emailInvalid = true;
      this.errorMessage = `El dominio ${domain} no está permitido.`;
      return;
    }
  }

  // Validar la seguridad de la contraseña
  validatePassword(): void {
    // Longitud mínima de la contraseña
    if (this.password.length < this.minPasswordLength) {
      this.passwordInvalid = true;
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
    }

    // Validar si la contraseña contiene caracteres maliciosos
    if (this.injectionPattern.test(this.password)) {
      this.passwordInvalid = true;
      this.errorMessage = 'La contraseña contiene caracteres no permitidos.';
    }
  }

  // Método para mostrar u ocultar la contraseña
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  // Resetear los estados de error para todas las validaciones
  resetValidationStates(): void {
    this.emailInvalid = false;
    this.passwordInvalid = false;
    this.domainInvalid = false;
    this.loginFailed = false;
    this.errorMessage = '';
  }

  // Resetear solo los estados de validación de email
  resetEmailValidationStates(): void {
    this.emailInvalid = false;
    this.domainInvalid = false;
    this.errorMessage = '';
  }



}

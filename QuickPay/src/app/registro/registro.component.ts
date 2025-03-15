import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-_ç<>])[A-Za-z\d@$!%*?&#+\-_ç<>]{8,}$/;
const PASSWORD_ERROR_MESSAGE =
  'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.';


@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent]
})
export class RegistroComponent {

  nombre: string = '';
  email: string = '';
  password1: string = '';
  password2: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  passwordVisible1 = false;
  passwordVisible2 = false;
  emailInvalid = false;
  fechaInvalid = false;
  isLoading: boolean = false;
  errorMessage: string = "";
  bloqueado = true;
  verificado = false;
  formattedDate: string = '';

  constructor(
    private readonly router: Router, private userService: UserService
  ) {}



  // Validación de formato de correo electrónico
  validateEmail(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailInvalid = !emailPattern.test(this.email);
  }

  
  // Validación de la contraseña
  validarPassword(): boolean {
    if (RegExp(PASSWORD_REGEX).exec(this.password1)) {
      this.passwordError = '';
      return true;
    } else {
      this.passwordError = PASSWORD_ERROR_MESSAGE;
      return false;
    }
  }

  validarConfirmPassword(): boolean {
    if (this.password1 === this.password2) {
      this.confirmPasswordError = '';
      return true;
    } else {
      this.confirmPasswordError = 'Las contraseñas no coinciden';
      return false;
    }
  }

  togglePasswordVisibility1(): void{ // Cambiar visibilidad de la contraseña
    this.passwordVisible1 = !this.passwordVisible1;
    const passwordInput1 = document.getElementById('password1') as HTMLInputElement;
    passwordInput1.type = this.passwordVisible1 ? 'text' : 'password';
  }

  togglePasswordVisibility2(): void{ // Cambiar visibilidad de la contraseña2
    this.passwordVisible2 = !this.passwordVisible2;
    const passwordInput2 = document.getElementById('password2') as HTMLInputElement;
    passwordInput2.type = this.passwordVisible2 ? 'text' : 'password';
    }

  // Compropbación de campos obligatorios y formato de correo electrónico y fecha alta
  onSubmit(): void {
    if (this.emailInvalid) {
      alert("Correo electrónico inválido");
      return;
    }

    // El primero comprueba el formato de la contraseña y 
    // el segundo si las contraseñas coinciden
    if (!this.validarPassword()) {
      alert("Contraseña inválida");
      return;
    } else if(!this.validarConfirmPassword()) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    // Validar si los campos obligatorios están vacíos
    if (!this.nombre || !this.email ||!this.password1 || !this.password2) {
      this.errorMessage = 'Todos los campos obligatorios deben estar llenos.';
      return;
    }
    const userData = {
      name: this.nombre,
      email: this.email,
      password: this.password1,
  
    };

    console.log("Datos del usuario a registrar:", userData);
    alert(`Datos introducidos:
    - Nombre: ${userData.name}
    - Email: ${userData.email}
    - Contraseña: ${userData.password}`);

    this.userService.registerUser(userData).subscribe({
      next: (response) => {
          console.log("Registro exitoso:", response);
          this.isLoading = false;
          alert("Registro exitoso");

          // Redirigir al login después de registrar
          this.router.navigate(['/login']);
      },
      error: (error) => {
          console.error("Error en el registro:", error);
          this.isLoading = false;
          alert("Hubo un error. Intente en otro momento.");
      }
  });

  }
  
  // Método para redirigir a las diferentes páginas
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }

  focusNext(nextFieldIf: string){
    const nextElement = document.getElementById(nextFieldIf);
    if (nextElement){
      nextElement.focus();
    }
  }
}
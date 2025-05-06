import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
@Component({
  selector: 'app-reset-contrasena',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './reset-contrasena.component.html',
  styleUrl: './reset-contrasena.component.css'
})
export class ResetContrasenaComponent {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  mensaje: string = '';
  error: string = '';
  isValidToken: boolean = false;
  passwordVisible1: boolean = false;
  passwordVisible2: boolean = false;

  togglePasswordVisibility1(): void {
    this.passwordVisible1 = !this.passwordVisible1;
    const passwordInput = document.getElementById('password1') as HTMLInputElement;
    passwordInput.type = this.passwordVisible1 ? 'text' : 'password';
  }

  togglePasswordVisibility2(): void {
    this.passwordVisible2 = !this.passwordVisible2;
    const passwordInput = document.getElementById('password2') as HTMLInputElement;
    passwordInput.type = this.passwordVisible2 ? 'text' : 'password';
  }


  // Ir a otra ruta
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.userService.validateToken(this.token).subscribe({
          next: () => {
            this.isValidToken = true;
          },
          error: () => {
            this.isValidToken = false;
          }
        });
      } else {
        this.isValidToken = false;
      }
    });
  }
  


  onSubmit(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.error = 'Debes completar ambos campos de contraseña.';
      return;
    }
  
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }
  
    this.userService.resetPassword(this.token, this.newPassword, this.confirmPassword)
      .subscribe({
        next: () => {
          this.mensaje = '¡Contraseña restablecida con éxito!';
          alert(this.mensaje);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Error al restablecer la contraseña.';
        }
      });
  }
  

}
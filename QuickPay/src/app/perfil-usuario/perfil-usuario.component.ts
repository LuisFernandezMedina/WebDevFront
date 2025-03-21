import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';



@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent, HeaderComponent],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {

  user = {
    nombre: 'Nombre de usuario',
    apellidos: 'Apellidos de usuario',
    correo: 'user@correo.com',
    depart: 'Departamento',
    centroTrabajo: 'Centro de Trabajo',
    alta: 'Fecha de alta',
    perfil: 'Perfil'
  };

  profilePicture: string | ArrayBuffer | null = 'assets/UsuarioSinFoto.png';
  isLoading: boolean = false;
  token: string = '';

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    const token = sessionStorage.getItem('token') || '';
    const localEmail = sessionStorage.getItem('email') || '';

    // Obtener el parámetro 'email' de la URL
    const routeEmail = this.route.snapshot.paramMap.get('email');

    // Determinar el email a usar
    const emailToUse = routeEmail || localEmail;

    if (token && emailToUse) {
      this.getUserInfo(emailToUse, token);
    } else {
      console.error('No se encontró un email válido para cargar el perfil');
    }
  }

  getUserInfo(email: string, token: string): void {
  
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.profilePicture = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  // Método para redirigir a cambiar la contraseña
  navigateToChangePassword(): void {
    this.router.navigate(['/edicion-usuario'], { state: { token: this.token } });
  }


  editUser(userEmail: string): void {
    if (userEmail) {
      const token = sessionStorage.getItem('token') || '';
      const role = this.decodeRoleFromToken(token); // Decodificar el rol desde el token
  
      // Redirigir al formulario de edición con el estado del usuario
      this.router.navigate(['/edicion-usuario'], {
        state: {
          user: this.user.correo, // Pasar el correo del usuario
          role: role // Pasar el rol (administrador o empleado)
        },
      });
    } else {
      console.error('El correo electrónico del usuario no está definido');
    }
  }

  // Método para decodificar el rol desde el token
  private decodeRoleFromToken(token: string) {
   
  }

  // Método para redirigir a las diferentes páginas
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}
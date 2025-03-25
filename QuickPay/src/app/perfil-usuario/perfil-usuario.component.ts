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

  id: number = 0;
  user = {
    nombre: 'Nombre y apellidos de usuario',
    correo: 'user@correo.com',
    balance: '9999.00'
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
    // Comprobamos que estamos en el navegador
    alert(sessionStorage.getItem('authToken'))
    this.token = sessionStorage.getItem('authToken') || '';  
    const emailToUse = sessionStorage.getItem('email') || '';  
    
    if (this.token && emailToUse) {
      this.getUserInfo(emailToUse, this.token);
    } else {
      console.error('No se encontró un email válido o token para cargar el perfil');
      this.router.navigate(['/login']);
    }
  }
  

  getUserInfo(email: string, token: string): void {
    this.isLoading = true;
    this.id = Number(sessionStorage.getItem('userid'));
    this.userService.getUser(this.id,token).subscribe({
      next: (response) => {
        this.user = {
          nombre: response.name,
          correo: response.email,
          balance: response.balance || '0.00'
        };
        this.profilePicture = response.profilePicture || 'assets/UsuarioSinFoto.png';
        this.isLoading = false;
        alert(this.user.nombre)
        
      },
      
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
        this.isLoading = false;
      }
    });
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

  navigateToChangePassword(): void {
    this.router.navigate(['/edicion-usuario'], { state: { token: this.token } });
  }

  editUser(userEmail: string): void {
    if (userEmail) {
      const role = this.decodeRoleFromToken(this.token);
      this.router.navigate(['/edicion-usuario'], {
        state: {
          user: this.user.correo,
          role: role
        },
      });
    } else {
      console.error('El correo electrónico del usuario no está definido');
    }
  }

  private decodeRoleFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || 'user';
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return 'user';
    }
  }

  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}

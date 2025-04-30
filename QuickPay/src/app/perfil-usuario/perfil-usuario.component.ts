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
    balance: '9999.00',
    newPassword: ''
  };

  profilePicture: string | ArrayBuffer | null = 'assets/UsuarioSinFoto.png';
  isLoading: boolean = false;
  token: string = '';
  isEditing: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.token = sessionStorage.getItem('authToken') || '';
    const userIdFromRoute = this.route.snapshot.paramMap.get('id');
    const role = this.decodeRoleFromToken(this.token); // ⚠️ devuelve number
    const isAdmin = role === 1;
  
    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }
  
    if (userIdFromRoute && isAdmin) {
      // ✅ Admin accediendo al perfil de otro usuario
      this.id = +userIdFromRoute;
      this.getUserById(this.id, this.token);
    } else {
      // ✅ Usuario accediendo a su propio perfil
      const emailToUse = sessionStorage.getItem('email') || '';
      if (emailToUse) {
        this.id = Number(sessionStorage.getItem('userid'));
        this.getUserInfo(emailToUse, this.token);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
  
  getUserById(userId: number, token: string): void {
    console.log('Cargando perfil de usuario con ID:', userId); // 👈 comprueba esto

    this.isLoading = true;
  
    this.userService.getUser(userId, token).subscribe({
      next: (response) => {
        this.user = {
          nombre: response.name,
          correo: response.email,
          balance: response.balance || 0,
          newPassword: ''
        };
        this.profilePicture = response.profilePicture || 'assets/UsuarioSinFoto.png';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuario por ID:', error);
        this.isLoading = false;
      }
    });
  }
  
  
  
  getUserInfoById(userId: number, token: string): void {
  this.isLoading = true;

  this.userService.getUser(userId, token).subscribe({
    next: (response) => {
      this.user = {
        nombre: response.name,
        correo: response.email,
        balance: response.balance || '0.00',
        newPassword: ''
      };
      this.profilePicture = response.profilePicture || 'assets/UsuarioSinFoto.png';
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error al cargar el usuario:', error);
      this.isLoading = false;
    }
  });
}


  getUserInfo(email: string, token: string): void {
    this.isLoading = true;
    this.id = Number(sessionStorage.getItem('userid'));
    this.userService.getUser(this.id,token).subscribe({
      next: (response) => {
        this.user = {
          nombre: response.name,
          correo: response.email,
          balance: response.balance || '0.00',
          newPassword: ''
        };
        this.profilePicture = response.profilePicture || 'assets/UsuarioSinFoto.png';
        this.isLoading = false;
        //alert(this.user.nombre)
        
      },
      
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
        this.isLoading = false;
      }
    });
  }

  
  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (!this.isEditing) {
      this.getUserInfo(this.user.correo, this.token);
    }
  }

  saveChanges(): void {
    const updatedData: any = { name: this.user.nombre };
  
    if (this.user.newPassword) {
      updatedData.password = this.user.newPassword;
    }
  
    const role = this.decodeRoleFromToken(this.token);
    const isAdmin = role === 1;
  
    if (isAdmin) {
      this.userService.updateUserAsAdmin(this.id, updatedData, this.token).subscribe({
        next: () => {
          // 🔄 Llamada separada para actualizar balance con número
          const balanceAsNumber = Number(this.user.balance);
          this.userService.updateUserBalanceAsAdmin(this.id, balanceAsNumber, this.token).subscribe({
            next: () => {
              alert('Usuario actualizado por admin');
              this.isEditing = false;
            },
            error: (err) => {
              console.error('Error actualizando balance:', err);
              alert('Nombre actualizado, pero fallo al actualizar balance');
            }
          });
        },
        error: (error) => {
          console.error('Error actualizando como admin:', error);
          alert('Error al actualizar usuario');
        },
      });
    } else {
      this.userService.updateUser(this.id, updatedData, this.token).subscribe({
        next: () => {
          alert('Perfil actualizado correctamente');
          this.isEditing = false;
          this.user.newPassword = '';
        },
        error: (error) => {
          console.error('Error al actualizar perfil:', error);
          alert('Error al actualizar perfil');
        },
      });
    }
  }
  
  

  isFormValid(): boolean {
    return this.user.nombre.trim() !== '';
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

  private decodeRoleFromToken(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Number(payload.role); // 🔐 fuerza número
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return 0;
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

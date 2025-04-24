import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { ListaAdminsComponent } from "../shared/lista-admins/lista-admins.component";
import { ListaUsuariosComponent } from '../shared/lista-usuarios/lista-usuarios.component';


@Component({
  selector: 'app-ventana-principal',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent, ListaUsuariosComponent, ListaAdminsComponent],
  templateUrl: './ventana-principal.component.html',
  styleUrls: ['./ventana-principal.component.css']
})
export class VentanaPrincipalComponent implements OnInit {
  titulo: string = 'Bienvenido a la Ventana Principal';
  isAdmin: boolean | null = null;
  token: string = '';
  myemail: string = '';
  isLoading: boolean = false;
  selectedUser: any = null;
  showDeleteModal: boolean = false;
  countdown: number = 5;
  countdownInterval: any;
  activeTab: string = 'tab1'; // Por defecto, la pestaña 1 está activa
  id: number = 0;
  localEmail: string = '';
  balance: string = '0.00';

  loggedUser: any = {
    firstName: 'John',
    lastName: 'Doe',
    profilePicture: '/assets/images/UsuarioSinFoto.png',
    role: 'admin'
  };

  user = {
    nombre: 'Nombre y apellidos de usuario',
    correo: 'user@correo.com',
    balance: '9999.00'
  };

  
  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.token = sessionStorage.getItem('authToken') || '';
    this.localEmail = sessionStorage.getItem('email') || '';
    this.isAdmin = this.isAdminUser();
    console.log("¿Es admin?", this.isAdmin);
        //alert(sessionStorage.getItem('authToken'));
  }
  getUserInfo(email: string, token: string): void {
    this.isLoading = true;
    this.id = Number(sessionStorage.getItem('userid'));
    this.userService.getUser(this.id,token).subscribe({
      next: (response) => {
        this.balance = response.balance || '0.00';
        this.isLoading = false;
        //alert(this.user.nombre)
        
      },
      
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
        this.isLoading = false;
      }
    });
  }
  private isAdminUser(): boolean {
    const token = this.token;
    if (!token) {
      return false;
    }
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload:', payload); // Útil para depurar
      return payload.role === 1; // ✅ Aquí la corrección
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return false;
    }
  }
  
  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']); 
  }
  
  visitProfile(selectedUser: any): void {
    if (selectedUser) {
      sessionStorage.setItem('email', selectedUser.email);
      const route = selectedUser.isAdmin ? '/perfil-admin' : '/perfil-usuario';
      this.router.navigate([route]);
    } else {
      console.error('El usuario seleccionado no está definido');
    }
  }
  

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  // Método para navegar a una ruta específica
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}
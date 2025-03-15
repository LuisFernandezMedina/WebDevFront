import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventana-principal',
  standalone: true,
  imports: [],
  templateUrl: './ventana-principal.component.html',
  styleUrl: './ventana-principal.component.css'
})
export class VentanaPrincipalComponent {
  constructor(private router: Router) {}

  logout() {
    sessionStorage.removeItem('authToken'); // Eliminar token al cerrar sesión
    this.router.navigate(['/login']); // Redirigir al login
  }
}

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { RegistroComponent } from './registro/registro.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { VentanaPrincipalComponent } from './ventana-principal/ventana-principal.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige la ruta vacía a /login
  { path: 'login', component: LoginComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'ventana-principal', component: VentanaPrincipalComponent },
  { path: 'perfil-usuario', component: PerfilUsuarioComponent }

];

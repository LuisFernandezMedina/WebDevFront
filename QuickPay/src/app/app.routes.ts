import { Routes } from '@angular/router';
import { AnadirBalanceComponent } from './anadir-balance/anadir-balance.component';
import { BizumComponent } from './bizum/bizum.component';
import { ContrasenaOlvidadaComponent } from './contrasena-olvidada/contrasena-olvidada.component';
import { LoginComponent } from './login/login.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { RegistroComponent } from './registro/registro.component';
import { ResetContrasenaComponent } from './reset-contrasena/reset-contrasena.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { ListaAdminsComponent } from './shared/lista-admins/lista-admins.component';
import { VentanaPrincipalComponent } from './ventana-principal/ventana-principal.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige la ruta vacía a /login
  { path: 'login', component: LoginComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'ventana-principal', component: VentanaPrincipalComponent },
  { path: 'perfil-usuario', component: PerfilUsuarioComponent },
  { path: 'perfil-usuario/:id', component: PerfilUsuarioComponent },
  { path: 'anadir-balance', component: AnadirBalanceComponent },
  { path: 'bizum/:tipo', component: BizumComponent },
  { path: 'lista-admins', component: ListaAdminsComponent },
  { path: 'contrasena-olvidada', component: ContrasenaOlvidadaComponent },
  { path: 'reset-password', component: ResetContrasenaComponent },


];

import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

console.log("🔥 provideHttpClient se está ejecutando en main.ts");

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(FormsModule),
    provideHttpClient(), // <-- Se asegura que HttpClient está disponible en el cliente
    provideRouter(routes)
  ]
}).catch(err => console.error("❌ Error en main.ts:", err));

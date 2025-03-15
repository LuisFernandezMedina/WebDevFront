import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';


// Exportamos una función que devuelve una promesa de bootstrapApplication()
export default function bootstrap() {
  return bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(FormsModule),
      provideHttpClient(),
      provideRouter(routes)
    ]
  }).catch(err => {
    console.error("❌ Error en main.server.ts:", err);
    throw err;
  });
}

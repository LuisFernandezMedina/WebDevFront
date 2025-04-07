import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-bizum',
  standalone: true,
  imports: [],
  templateUrl: './bizum.component.html',
  styleUrl: './bizum.component.css'
})
export class BizumComponent {
  tipoOperacion: 'send' | 'request' | null = null;
  usuarioSeleccionado: any = null;

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    this.tipoOperacion = this.route.snapshot.paramMap.get('tipo') as 'send' | 'request';
    const nav = this.location.getState() as { usuario?: any };
    this.usuarioSeleccionado = nav.usuario ?? null;
  
    console.log('Tipo:', this.tipoOperacion);
    console.log('Usuario:', this.usuarioSeleccionado);
  }

}

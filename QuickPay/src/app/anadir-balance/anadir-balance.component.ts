import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditCardService } from '../services/credit-card.service';
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-anadir-balance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent, HeaderComponent],
  templateUrl: './anadir-balance.component.html',
  styleUrl: './anadir-balance.component.css'
})
export class AnadirBalanceComponent {
  card_number: string = '';
  expiration_date: string = '';
  cvv: string = '';
  cardholder_name: string = '';
  amount: number = 0;

  passwordVisible = false;
  isLoading = false;
  message: string = '';
  isError = false;
  
  @ViewChild('CreditCardForm') creditcardForm!: NgForm;
  
  user = {
    nombre: 'Nombre y apellidos de usuario',
    correo: 'user@correo.com',
    balance: 9999.00
  };

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly creditCardService: CreditCardService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  // 🔹 Validar la tarjeta y añadir saldo
  addBalance(): void {
    if (this.amount <= 0) {
      this.message = 'La cantidad debe ser mayor a 0.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.message = '';

    const cardInfo = {
      card_number: this.card_number,
      cardholder_name: this.cardholder_name,
      cvv: this.cvv,
      expiration_date: this.expiration_date
    };

    // Validar tarjeta
    this.creditCardService.validateCard(cardInfo).subscribe({
      next: (res) => {
        if (res) {
          const userId = Number(sessionStorage.getItem('userid'));
          const token = sessionStorage.getItem('authToken') || '';

          // Añadir saldo
          this.creditCardService.addBalance(userId, this.amount, token).subscribe({
            next: (response) => {
              this.message = 'Saldo añadido con éxito.';
              this.user.balance += this.amount; // Actualizar balance en UI
              this.isError = false;
              setTimeout(() => this.router.navigate(['/perfil-usuario']), 2000);
            },
            error: () => {
              this.message = 'Error al añadir saldo.';
              this.isError = true;
              this.isLoading = false;
            }
          });
        } else {
          this.message = 'Tarjeta no válida.';
          this.isError = true;
          this.isLoading = false;
        }
      },
      error: () => {
        alert('User: ' + cardInfo);
        this.message = 'Error en la validación de la tarjeta.';
        this.isError = true;
        this.isLoading = false;
      }
    });
  }

  // 🔹 Mostrar u ocultar CVV
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('cvv') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  // 🔹 Redirección de navegación
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}

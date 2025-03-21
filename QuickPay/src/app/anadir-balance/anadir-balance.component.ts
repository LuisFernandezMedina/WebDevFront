import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  passwordVisible = false;
  card_number_Invalid = false;
  TransactionFailed = false;
  cvvInvalid = false;
  dateInvalid = false;
  errorMessage: string = '';
  @ViewChild('CreditCardForm') creditcardForm!: NgForm;
  user = {
    nombre: 'Nombre y apellidos de usuario',
    correo: 'user@correo.com',
    balance: '9999.00'
  };

  isLoading: boolean = false;
  token: string = '';

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.resetValidationStates();
  
  }
  resetValidationStates(): void {
    this.passwordVisible = false;
    this.card_number_Invalid = false;
    this.TransactionFailed = false;
    this.cvvInvalid = false;
    this.dateInvalid = false;
    this.errorMessage = '';
  }
  onCCChange(): void {
    
  }

  getUserInfo(email: string, token: string): void {
  
  }

  addBalance(): void {}
  
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('cvv') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }


  // Método para redirigir a las diferentes páginas
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}
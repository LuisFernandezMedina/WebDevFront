import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

export class AnadirBalanceComponent implements OnInit {
  user: any = { balance: 0 };
  direction: 'in' | 'out' = 'in';
  card_number: string = '';
  cardholder_name: string = '';
  expiration_date: string = '';
  cvv: string = '';
  amount: number = 0;
  passwordVisible: boolean = false;

  isLoading = false;
  message = '';
  isError = false;

  constructor(
    private userService: UserService,
    private creditCardService: CreditCardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(sessionStorage.getItem('userid'));
    const token = sessionStorage.getItem('authToken') || '';
    const email = sessionStorage.getItem('email') || '';

    if (id && token && email) {
      this.userService.getUser(id, token).subscribe({
        next: (user) => this.user = user,
        error: () => {
          this.message = 'Error al cargar el usuario';
          this.isError = true;
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const input = document.getElementById('cvv') as HTMLInputElement;
    if (input) {
      input.type = this.passwordVisible ? 'text' : 'password';
    }
  }
  addBalance(): void {
    this.message = '';
    this.isError = false;
    this.isLoading = true;
    const token = sessionStorage.getItem('authToken')!;

    const transferPayload = {
      card_number: this.card_number,
      cardholder_name: this.cardholder_name,
      cvv: this.cvv,
      expiration_date: this.expiration_date,
      amount: this.amount,
      direction: this.direction
    };

    const userId = Number(sessionStorage.getItem('userid'));

    if (this.direction === 'in') {
      // 💳 ➡️ 👤 Add balance to the card from the user
      if (this.user.balance < this.amount) {
        this.message = 'Insufficient balance in the user account';
        this.isError = true;
        this.isLoading = false;
        return;
      }

      this.creditCardService.transfer(transferPayload).subscribe({
        next: (res) => {
          if (res.success) {
            this.userService.retireBalance(userId, this.amount, token).subscribe({
              next: () => {
                this.user.balance -= this.amount; // Deduct from user balance
                this.message = 'Transfer to the card successful';
                this.isLoading = false;
              },
              error: () => {
                this.message = 'Error while withdrawing balance from the user';
                this.isError = true;
                this.isLoading = false;
              }
            });
          } else {
            this.message = res.error || 'Error transferring to the card';
            this.isError = true;
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.message = err.error?.error || 'Unexpected error';
          this.isError = true;
          this.isLoading = false;
        }
      });
    } else {
      // 👤 ➡️ 💳 Add balance to the user from the card
      this.creditCardService.transfer(transferPayload).subscribe({
        next: (res) => {
          if (res.success) {
            this.userService.addBalance(userId, this.amount, token).subscribe({
              next: () => {
                this.user.balance += this.amount; // Add to user balance
                this.message = 'Balance added successfully from the card';
                this.isLoading = false;
              },
              error: () => {
                this.message = 'Error updating the user balance';
                this.isError = true;
                this.isLoading = false;
              }
            });
          } else {
            this.message = res.error || 'Error loading from the card';
            this.isError = true;
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.message = err.error?.error || 'Unexpected error';
          this.isError = true;
          this.isLoading = false;
        }
      });
    }
}


  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
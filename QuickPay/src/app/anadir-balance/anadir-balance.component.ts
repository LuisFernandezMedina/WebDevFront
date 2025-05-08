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

  savedCards: any[] = [];
  selectedCardId: string = '';
  showSaveOption: boolean = false;

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

      this.creditCardService.getUserCards(id).subscribe({
        next: (cards) => {
        this.savedCards = cards.filter((c: any) => c.user_id === id);
      },
        error: () => console.warn('❌ No se pudieron cargar tarjetas guardadas')
      });
    }
  }

  onSelectCard(cardId: string): void {
    const card = this.savedCards.find(c => c.id == cardId);
    if (card) {
      this.card_number = card.card_number;
      this.cardholder_name = card.cardholder_name;
      this.expiration_date = card.expiration_date;
      this.cvv = '';
      this.showSaveOption = false;
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
    const userId = Number(sessionStorage.getItem('userid'));

    const transferPayload = {
      card_number: this.card_number,
      cardholder_name: this.cardholder_name,
      cvv: this.cvv,
      expiration_date: this.expiration_date,
      amount: this.amount,
      direction: this.direction
    };

    if (this.showSaveOption) {
      const newCard = {
        card_number: this.card_number,
        cardholder_name: this.cardholder_name,
        cvv: this.cvv,
        expiration_date: this.expiration_date,
        user_id: userId
      };

      this.creditCardService.createCardForUser(userId, newCard).subscribe({
        next: () => console.log('💾 Tarjeta guardada'),
        error: () => console.warn('⚠️ No se pudo guardar la tarjeta')
      });
    }

    this.creditCardService.transfer(transferPayload).subscribe({
      next: (res) => {
        if (res.success) {
          this.userService.addBalance(userId, this.amount, token).subscribe({
            next: () => {
              this.user.balance += this.amount;
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

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  shouldShowSaveOption(): boolean {
    return !this.savedCards.some(c => c.card_number === this.card_number);
  }
  
}

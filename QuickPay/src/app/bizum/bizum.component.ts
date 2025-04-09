import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-bizum',
  templateUrl: './bizum.component.html',
  styleUrls: ['./bizum.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
})
export class BizumComponent implements OnInit {
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  operationType: 'send' | 'request' = 'send';
  selectedUser: any = null;
  loggedUser: any = null;
  amount: number = 0;
  message: string = '';
  error: boolean = false;
  token: string = '';

  ngOnInit(): void {
    const tipoFromUrl = this.route.snapshot.paramMap.get('tipo') as 'send' | 'request';
    this.operationType = tipoFromUrl || 'send';

    // 🔹 Recuperar destinatario desde history.state
    this.selectedUser = history.state.usuario;

    this.token = sessionStorage.getItem('authToken') || '';
    const userId = sessionStorage.getItem('userid');

    if (this.token && userId) {
      this.userService.getUser(+userId, this.token).subscribe({
        next: (res) => {
          this.loggedUser = res;
        },
        error: () => {
          this.message = 'Error loading user data';
          this.error = true;
        }
      });
    } else {
      this.message = 'Session is not valid. Please log in again.';
      this.error = true;
      this.router.navigate(['/login']);
    }
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  makeTransfer(): void {
    if (!this.amount || this.amount <= 0) {
      this.message = 'Please enter a valid amount';
      this.error = true;
      return;
    }

    if (this.amount > this.loggedUser.balance) {
      this.message = 'Insufficient balance';
      this.error = true;
      return;
    }

    this.userService.transferMoney(this.loggedUser.id, this.selectedUser.id, this.amount, this.token).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Transfer completed successfully';
        this.error = false;
        this.loggedUser.balance = res.sender_balance; // update balance
      },
      error: (err: any) => {
        this.message = err.error?.error || 'Error making the transfer';
        this.error = true;
      }
    });
  }
  newRequest(): void {
    // TODO: implement request logic
    this.message = 'Request feature is not implemented yet';
    this.error = true;
  }
  
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {
  private userApiUrl = 'http://127.0.0.1:3000';  // Backend de usuarios
  private cardApiUrl = 'http://127.0.0.1:4000';  // Backend de tarjetas

  constructor(private http: HttpClient) {}

  // 🔹 Añadir saldo al usuario (BACKEND: 3000)
  addBalance(userId: number, amount: number, token: string): Observable<any> {
    return this.http.post(`${this.userApiUrl}/users/${userId}/add_balance`, { amount }, {
      headers: this.getAuthHeaders(token),
    });
  }

  // 🔹 Retirar saldo (BACKEND: 3000)
  retireBalance(userId: number, amount: number, token: string): Observable<any> {
    return this.http.post(`${this.userApiUrl}/users/${userId}/retire_balance`, { amount }, {
      headers: this.getAuthHeaders(token),
    });
  }

  // 🔹 Validar tarjeta (BACKEND: 4000)
  validateCard(cardInfo: { card_number: string; cardholder_name: string; cvv: string; expiration_date: string }): Observable<boolean> {
    return this.http.post<boolean>(`${this.cardApiUrl}/validate_card`, cardInfo);
  }

  // 🔹 Generar headers con token
  private getAuthHeaders(token: string) {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
}

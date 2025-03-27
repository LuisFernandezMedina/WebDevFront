import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CreditCardTransferRequest {
  card_number: string;
  cardholder_name: string;
  cvv: string;
  expiration_date: string; // Format: 'YYYY-MM-DD'
  amount: number;
  direction: 'in' | 'out'; // 'in' = from card to user, 'out' = from user to card
}

export interface CreditCardTransferResponse {
  success: boolean;
  new_balance?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {
  private apiUrl = 'http://localhost:3000/payment_cards';

  constructor(private http: HttpClient) {}

  transfer(data: CreditCardTransferRequest): Observable<CreditCardTransferResponse> {
    return this.http.post<CreditCardTransferResponse>(`${this.apiUrl}/transfer`, data);
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(cardData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, cardData);
  }

  update(id: number, cardData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cardData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

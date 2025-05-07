import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:3001'; // URL del backend de Rails

  constructor(private http: HttpClient) {}

  // 🔹 REGISTRAR USUARIO (Signup)
  registerUser(userData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  // 🔹 INICIAR SESIÓN (Login) Y GUARDAR TOKEN
  loginUser(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // 🔹 OBTENER DETALLES DEL USUARIO
  getUser(userId: number, token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`, {
      headers: this.getAuthHeaders(token),
    });
  }

  // 🔹 ACTUALIZAR DATOS DEL USUARIO
  updateUser(userId: number, updatedData: any, token: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}`, updatedData, {
      headers: this.getAuthHeaders(token),
    });
  }

  // 🔹 ELIMINAR USUARIO
  deleteUser(userId: number, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, {
      headers: this.getAuthHeaders(token),
    });
  }

  // 🔹 OBTENER USUARIO POR EMAIL
  getUserByEmail(email: string, token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/email/${encodeURIComponent(email)}`, {
      headers: this.getAuthHeaders(token),
    });
  }

  // 🔹 AÑADIR SALDO
  addBalance(userId: number, amount: number, token: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/add_balance`, { amount }, {
      headers: this.getAuthHeaders(token)
    });
  }


  // 🔹 OBTENER TODOS LOS USUARIOS
  getAllUsers(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders(token)
    });
  }

  // 🔹 OBTENER TRANSACCIONES DE UN USUARIO
  getTransactions(userId: number, token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}/transactions`, {
      headers: this.getAuthHeaders(token)
    });
  }

  // 🔹 TRANSFERIR DINERO ENTRE USUARIOS
  transferMoney(senderId: number, receiverId: number, amount: number, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/transfer_money`, {
      sender_id: senderId,
      receiver_id: receiverId,
      amount: amount
    }, {
      headers: this.getAuthHeaders(token)
    });
  }

  // 🆕 🔹 CREAR NUEVA SOLICITUD DE DINERO
  newRequest(requesterId: number, recipientId: number, amount: number, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/requests`, {
      requester_id: requesterId,
      recipient_id: recipientId,
      amount: amount
    }, {
      headers: this.getAuthHeaders(token)
    });
  }

  // 🆕 🔹 VER SOLICITUDES ENVIADAS Y RECIBIDAS
  myRequests(userId: number, token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}/requests`, {
      headers: this.getAuthHeaders(token)
    });
  }

  // 🆕 🔹 ACEPTAR UNA SOLICITUD DE DINERO
  acceptRequest(requestId: number, token: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/requests/${requestId}/accept`, {}, {
      headers: this.getAuthHeaders(token)
    });
  }

  // 🆕 🔹 RECHAZAR (ELIMINAR) UNA SOLICITUD DE DINERO
  deleteRequest(requestId: number, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/requests/${requestId}/reject`, {
      headers: this.getAuthHeaders(token)
    });
  }

  // 🔐 🔹 GENERAR HEADERS CON TOKEN
  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // 🛠️ ADMIN: MODIFICAR USUARIO
  updateUserAsAdmin(userId: number, updatedData: any, token: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/users/${userId}`, updatedData, {
      headers: this.getAuthHeaders(token),
    });
  }

  // 🗑️ ADMIN: ELIMINAR USUARIO
  deleteUserAsAdmin(userId: number, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}`, {
      headers: this.getAuthHeaders(token),
    });
  }

  // 💰 ADMIN: MODIFICAR BALANCE DE USUARIO
  updateUserBalanceAsAdmin(userId: number, balance: number, token: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/users/${userId}/modify_balance`, { balance }, {
      headers: this.getAuthHeaders(token),
    });
  }

  // 🔁 ADMIN: CANCELAR TRANSACCIÓN
  cancelTransactionAsAdmin(transactionId: number, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/transactions/${transactionId}`, {
      headers: this.getAuthHeaders(token),
    });
  }
  resetPasswordLink(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password_resets`, { email });
  }
  
  resetPassword(token: string, password: string, password_confirmation: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/password_resets`, {
      token,
      password,
      password_confirmation
    });
  }
  validateToken(token: string) {
    return this.http.get(`${this.apiUrl}/password_resets/validate`, {
      params: { token },
    });
  }
    
  // 🔗 SEGUIR A UN USUARIO
  followUser(myId: number, friendId: number, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${myId}/follow?friend_id=${friendId}`, null, {
      headers: this.getAuthHeaders(token)
    });
  }

  // ❌ DEJAR DE SEGUIR A UN USUARIO
  unfollowUser(myId: number, friendId: number, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${myId}/unfollow?friend_id=${friendId}`, {
      headers: this.getAuthHeaders(token)
    });
  }

  // 👥 OBTENER LISTA DE AMIGOS
  getFriends(myId: number, token: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${myId}/friends`, {
      headers: this.getAuthHeaders(token)
    });
  }
  
}

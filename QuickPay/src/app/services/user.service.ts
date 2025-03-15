import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:3000'; // URL del backend de Rails

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

  // 🔹 GENERAR HEADERS CON TOKEN
  private getAuthHeaders(token: string) {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
}

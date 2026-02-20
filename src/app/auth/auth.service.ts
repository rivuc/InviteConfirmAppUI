import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap, map } from 'rxjs';

interface TokenResponse {
  access_token: string;
  expires_In: number; // segundos (ej: 1500 = 25 min)
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = signal<string | null>(null);
  private expiresAt = signal<number | null>(null);

  constructor(private http: HttpClient) {}

  /** Devuelve token válido o null */
  getValidToken(): string | null {
    const expires = this.expiresAt();
    if (!this.token() || !expires) return null;

    // margen de seguridad de 30s
    if (Date.now() > expires - 30_000) return null;

    return this.token();
  }

  /** Obtiene nuevo token del backend */
  fetchToken(): Observable<string> {
    const credentials = `${environment.auth.clientId}:${environment.auth.clientSecret}`;
    const basicAuth = btoa(credentials); // base64

    const headers = new HttpHeaders({
      Authorization: `Basic ${basicAuth}`,
    });

    return this.http.post<TokenResponse>(`${environment.apiUrl}/api/token`, {}, { headers }).pipe(
      tap((res) => {
        this.token.set(res.access_token);
        this.expiresAt.set(Date.now() + res.expires_In * 1000);
      }),
      map((res) => res.access_token),
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { isTokenExpired } from '../utils/jwt.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8088/auth';
  private readonly accessTokenKey = 'accessToken';
  private readonly refreshTokenKey = 'refreshToken';

  isAuthenticated$ = new BehaviorSubject<boolean>(this.hasValidToken());
  isRefreshingToken = false;

  constructor(private http: HttpClient) {
    console.log('HttpClient:', http);  // Log to ensure HttpClient is injected properly
  }

  // Check if a valid access token exists
  hasValidToken(): boolean {
    const token = this.getAccessToken();
    return token !== null && !isTokenExpired(token);
  }

  // Login and store tokens
  login(username: string, password: string): Observable<any> {
    return this.http.post<{ accessToken: string; refreshToken: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((tokens) => this.storeTokens(tokens)),
      catchError((err) => {
        console.error('Login failed:', err);
        return throwError(() => new Error('Login failed.'));
      })
    );
  }

  // Refresh the access token
  refreshToken(): Observable<any> {
    if (this.isRefreshingToken || !this.http) {
      return of(null); // Prevent multiple concurrent refresh requests or undefined HttpClient
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available.'));
    }

    this.isRefreshingToken = true;
    return this.http.post<{ accessToken: string; refreshToken: string }>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((tokens) => this.storeTokens(tokens)),
      catchError((err) => {
        console.error('Token refresh failed:', err);
        this.logout();
        return throwError(() => new Error('Token refresh failed.'));
      }),
      tap(() => (this.isRefreshingToken = false))
    );
  }

  // Get tokens
  getAccessToken(): string | null {
    const token = localStorage.getItem(this.accessTokenKey);
    if (token && isTokenExpired(token)) {
      this.refreshToken().subscribe();
      return null;
    }
    return token;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // Logout and clear stored tokens
  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isAuthenticated$.next(false);
  }

  // Store tokens
  storeTokens(tokens: { accessToken: string; refreshToken: string }): void {
    localStorage.setItem(this.accessTokenKey, tokens.accessToken);
    localStorage.setItem(this.refreshTokenKey, tokens.refreshToken);
    this.isAuthenticated$.next(true);
  }
}

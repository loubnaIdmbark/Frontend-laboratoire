import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { isTokenExpired } from '../utils/jwt.utils';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8088/auth';
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  isRefreshingToken = false;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((tokens: any) => this.storeTokens(tokens))
    );
  }

  refreshToken(): Observable<any> {
    if (this.isRefreshingToken) {
      return of(null); // Prevent multiple refresh requests
    }

    this.isRefreshingToken = true;
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.logout();
      return of(null);
    }

    return this.http.post(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((tokens: any) => this.storeTokens(tokens)),
      catchError(err => {
        this.logout(); // If refresh fails, log out the user
        return of(null);
      }),
      tap(() => (this.isRefreshingToken = false))
    );
  }

  getAccessToken(): string | null {
    const token = localStorage.getItem(this.accessTokenKey);
    if (token && isTokenExpired(token)) {
      this.refreshToken().subscribe();
    }
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isAuthenticated$.next(false);
  }

  storeTokens(tokens: { accessToken: string; refreshToken: string }): void {
    localStorage.setItem(this.accessTokenKey, tokens.accessToken);
    localStorage.setItem(this.refreshTokenKey, tokens.refreshToken);
    this.isAuthenticated$.next(true);
  }
}

import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './login.service';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Inject AuthService
  let accessToken = authService.getAccessToken();

  if (accessToken) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        // Attempt to refresh the token
        return authService.refreshToken().pipe(
          switchMap((tokens: any) => {
            if (tokens) {
              authService.storeTokens(tokens); // Save new tokens
              const newToken = tokens.accessToken;
              const clonedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(clonedReq);
            } else {
              authService.logout(); // Log out if token refresh fails
              return throwError(() => error);
            }
          })
        );
      }
      return throwError(() => error);
    })
  );
};

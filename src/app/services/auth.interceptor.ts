import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './login.service';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Inject AuthService
  let accessToken = authService.getAccessToken();

  // Exclude the refresh endpoint from adding Authorization headers
  const isRefreshEndpoint = req.url.includes('/refresh'); // Adjust the path as per your refresh endpoint

  if (accessToken && !isRefreshEndpoint) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 403 && !isRefreshEndpoint) {
        // Attempt to refresh the token
        console.log('Token expired. Attempting to refresh...');
        return authService.refreshToken().pipe(
          switchMap((tokens: any) => {
            if (tokens) {
              authService.storeTokens(tokens); // Save new tokens
              console.log("New token:", tokens);
              const newToken = tokens.accessToken;
              const clonedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(clonedReq);
            } else {
              // Optional: handle failed token refresh
              // authService.logout(); // Uncomment if you want to log out on failure
              return throwError(() => error);
            }
          })
        );
      }
      return throwError(() => error);
    })
  );
};

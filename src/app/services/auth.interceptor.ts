import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './login.service';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Inject AuthService
  

  // Exclude the refresh endpoint from adding Authorization headers
  const isRefreshEndpoint = req.url.includes('/refresh'); // Adjust the path as per your refresh endpoint
  const isLoginEndpoint = req.url.includes('/login'); // Adjust the path as per your login endpoint
  const isConsultationEndpoint = req.url.includes('/public'); // Adjust the path as per your consultation endpoint


  if (!isRefreshEndpoint && !isConsultationEndpoint && !isLoginEndpoint) {
    let accessToken = authService.getAccessToken();
    console.log('request intercepted:', req);
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
              console.log("New token acquired:", tokens);
              const newToken = tokens.accessToken;

              // Clone the original request with the new token
              const clonedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });

              // Retry the original request with the new token
              return next(clonedReq);
            } else {
              console.error('Token refresh failed.');
              return throwError(() => error);
            }
          }),
          catchError(refreshError => {
            console.error('Refresh token request failed:', refreshError);
            // Optional: Log out or redirect to login
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

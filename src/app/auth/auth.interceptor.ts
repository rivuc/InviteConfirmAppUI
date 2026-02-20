import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { switchMap, of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = authService.getValidToken();

  //no interceptar el endpoint de token
  if (req.url.includes('/api/token')) {
    return next(req);
  }

  // 1️⃣ Token aún válido → úsalo
  if (token) {
    return next(
      req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    );
  }
  // 2️⃣ Token expirado o inexistente → pedir uno nuevo
  return authService.fetchToken().pipe(
    switchMap((newToken) =>
      next(
        req.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` },
        })
      )
    )
  );
};

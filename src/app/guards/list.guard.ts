import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { sha256 } from '../utils/crypto.util';

export const listGuard: CanActivateFn = async () => {
  const router = inject(Router);

  // 1. Leer query param
  const params = new URLSearchParams(window.location.search);
  const key = params.get('key');

  // 2. Si no hay key → fuera
  if (!key) {
    router.navigate(['/']);
    return false;
  }

  // 3. Hashear key
  const hashedKey = await sha256(key);

  // 4. Comparar contra environment
  if (hashedKey === environment.adminKeyHash) {
    return true;
  }

  // 5. Si no coincide → fuera
  router.navigate(['/']);
  return false;
};

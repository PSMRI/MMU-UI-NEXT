import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { HttpServiceService } from '../../core/services/http-service.service';
import { AuthService } from './auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  current_language_set: any;
  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http_service: HttpServiceService
  ) {}

  canActivate(route: any, state: any) {
    this.http_service.currentLangugae$.subscribe(
      response => (this.current_language_set = response)
    );
    return this.auth.validateSessionKey().pipe(
      tap((res: any) => {
        if (!(res && res.statusCode === 200 && res.data)) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'X-Permitted-Cross-Domain-Policies': 'none',
      'X-XSS-Protection': '1; mode = block',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'same-origin',
    })
    const authReq = req.clone({
      headers
    });

    return next.handle(authReq).pipe(catchError(this.manejoError));
  }

  manejoError(error: HttpErrorResponse) {
    return Promise.reject(error);
  }

}

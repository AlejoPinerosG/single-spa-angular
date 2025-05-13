import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

/**
 * Interceptor para agregar encabezados de seguridad a todas las solicitudes HTTP.
 * Este interceptor también maneja errores de las solicitudes HTTP.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Intercepta las solicitudes HTTP para agregar encabezados de seguridad.
   * @param req - La solicitud HTTP original.
   * @param next - El siguiente manejador en la cadena de interceptores.
   * @returns Un observable que representa el evento HTTP.
   */
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
    // Maneja la solicitud y captura errores.
    return next.handle(authReq).pipe(catchError(this.manejoError));
  }

  /**
   * Maneja errores de las solicitudes HTTP.
   * @param error - El error HTTP recibido.
   * @returns Una promesa rechazada con el error.
   */
  manejoError(error: HttpErrorResponse) {
    console.error('Error en la solicitud HTTP:', error);
    return Promise.reject(error);
  }

}

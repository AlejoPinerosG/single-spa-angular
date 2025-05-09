import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../enviroment/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { usuarios } from '../interfaces/usuariosList';
import { ApiResponse } from '../interfaces/apiResponse';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  getUsuarios(params: any): Observable<any> {
    return this.http.get<ApiResponse<usuarios[]>>(environment.enpoints.host + environment.urls.search + environment.urls.users, { params })
      .pipe(
        map((response: ApiResponse<any[]>) => {
          // Mapea los datos para capturar solo los elementos deseados
          console.log('response', response);
            return response.items.map((usuario: any) => ({
            avatar: usuario.avatar_url,
            login: usuario.login,
            score: usuario.score,
            url: usuario.html_url,
            id: usuario.id,
            }));
        }),
      catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }

}

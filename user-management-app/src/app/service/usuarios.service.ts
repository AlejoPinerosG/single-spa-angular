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
    const url = 'https://cors-anywhere.herokuapp.com/https://api.github.com/search/users?q=YOUR_NAME';
    return this.http.get<ApiResponse<usuarios[]>>(url, { params })
      .pipe(
        map((response: ApiResponse<any[]>) => {
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

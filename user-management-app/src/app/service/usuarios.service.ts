import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../enviroment/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { usuarios } from '../interfaces/usuariosList';
import { ApiResponse } from '../interfaces/apiResponse';

/**
 * Servicio para gestionar usuarios.
 * Este servicio se encarga de realizar las solicitudes HTTP necesarias para obtener la información de los usuarios.
 */
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  /**
   * Constructor del servicio.
   * @param http - HttpClient para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient) { }

  /**
   * Método para obtener la lista de usuarios.
   * @param params - Parámetros de búsqueda para la consulta.
   * @returns Observable con la lista de usuarios.
   */
  getUsuarios(params: any): Observable<any> {
    const url = environment.enpoints.host + environment.urls.search + environment.urls.users;
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
        // Maneja errores de la solicitud HTTP.
        catchError(this.errorHandler));
  }

  /**
   * Método para obtener un usuario específico por su ID.
   * @param id - ID del usuario a buscar.
   * @returns Observable con la información del usuario.
   */
  errorHandler(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }

}

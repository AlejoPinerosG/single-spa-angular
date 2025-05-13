import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { usuarios } from '../../interfaces/usuariosList';
import { UsuariosService } from '../../service/usuarios.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

/**
 * Componente para la gestión de usuarios.
 * Este componente muestra una tabla con los usuarios disponibles, permite navegar a los detalles de un usuario,
 * crear un nuevo usuario y eliminar usuarios existentes.
 */

const LOCAL_STORAGE_KEY = 'users';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatSlideToggleModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  /**
   * Columnas que se mostrarán en la tabla de usuarios.
   */
  public displayedColumns: string[] = ['avatar', 'login', 'actions'];
  public dataSource: Array<usuarios> = [];

  /**
 * Constructor del componente.
 * @param httpUsuarioService - Servicio para realizar solicitudes relacionadas con usuarios.
 * @param router - Router para navegar entre rutas.
 */
  constructor(private httpUsuarioService: UsuariosService, private router: Router) { }

  ngOnInit(): void {
    this.getUsuarios();
  }

  /**
  * Método que obtiene la lista de usuarios.
  * Si no hay datos en el localStorage, realiza una solicitud HTTP para obtener los usuarios
  * y los guarda en el localStorage. Si ya existen datos en el localStorage, los carga directamente.
  */
  getUsuarios() {
    this.dataSource = [];
    const params = { q: 'YOUR_NAME' };
    const existData = window.localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!existData) {
      params.q = 'YOUR_NAME';
      this.httpUsuarioService.getUsuarios(params).subscribe(
        {
          next: (res) => {
            this.dataSource = res;
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.dataSource));
          },
          error: (error) => {
            console.log('getConsultCont', error);
          }
        }
      );
    } else {
      this.dataSource = JSON.parse(existData);
    }
  }

  /**
  * Funcion que navega a la pantalla de detalles de un usuario.
  * @param id - ID del usuario al que se desea navegar.
  */
  navigateToDetail(id: string) {
    this.router.navigate(['/usuario-detail', id]);
  }

  /**
 * Funcion que navega a la pantalla para crear un nuevo usuario.
 */
  navigateToCreateUser() {
    this.router.navigate(['/create-user']);
  }

  /**
 * Elimina un usuario de la lista y del localStorage.
 * @param user - Usuario que se desea eliminar.
 */
  deleteUser(user: usuarios) {
    const index = this.dataSource.findIndex(u => u.login === user.login);
    if (index > -1) {
      this.dataSource.splice(index, 1);
      this.dataSource = [...this.dataSource];
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.dataSource));
      if (this.dataSource.length === 0) {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }

}

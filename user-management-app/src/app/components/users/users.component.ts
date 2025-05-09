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

export interface User {
  name: string;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

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

  public displayedColumns: string[] = ['avatar', 'login', 'actions'];
  public dataSource: Array<usuarios> = [];
  constructor(private httpUsuarioService: UsuariosService, private router: Router) { }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios() {
    this.dataSource = [];
    const params = { q: 'YOUR_NAME' };
    const existData = window.localStorage.getItem('users');

    if (!existData) {
      params.q = 'YOUR_NAME';
      this.httpUsuarioService.getUsuarios(params).subscribe(
        {
          next: (res) => {
            this.dataSource = res;
            window.localStorage.setItem('users', JSON.stringify(this.dataSource));
            console.log('getUsuarios', this.dataSource);
          },
          error: (error) => {
            console.log('getConsultCont', error);
          }
        }
      );
    } else {
      this.dataSource = JSON.parse(existData);
      console.log('getUsuarios', this.dataSource);
    }
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/usuario-detail', id]);
  }

  navigateToCreateUser() {
    this.router.navigate(['/create-user']);
  }

  deleteUser(user: usuarios) {
    console.log('deleteUser', user);
    const index = this.dataSource.findIndex(u => u.login === user.login);
    if (index > -1) {
      this.dataSource.splice(index, 1);
      this.dataSource = [...this.dataSource];
      window.localStorage.setItem('users', JSON.stringify(this.dataSource));
      if (this.dataSource.length === 0) {
        window.localStorage.removeItem('users');
      }
    }
  }

}

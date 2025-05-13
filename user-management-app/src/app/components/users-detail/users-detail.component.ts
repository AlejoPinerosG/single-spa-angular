import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule
import { ActivatedRoute, Router } from '@angular/router';
import { usuario } from '../../interfaces/usersDetail';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

/**
 * Componente para la visualización y edición de los detalles de un usuario.
 * Este componente permite mostrar los datos de un usuario, habilitar la edición de los campos
 * y guardar los cambios en el `localStorage`.
 */

@Component({
  selector: 'app-users-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './users-detail.component.html',
  styleUrl: './users-detail.component.scss'
})
export class UsersDetailComponent {

  userForm: FormGroup;
  public idUser = '';
  public dataSource: Array<usuario> = [];
  public usuarioDetail: usuario = { id: '', login: '', score: '', url: '', avatar: '' };
  public isEditMode = false;

  /**
 * Constructor del componente.
 * @param fb - FormBuilder para inicializar el formulario reactivo.
 * @param route - ActivatedRoute para manejar parámetros de la ruta.
 * @param router - Router para navegar entre rutas.
 */
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    // Inicializa el formulario con validaciones.
    this.userForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      login: ['', [Validators.required, Validators.minLength(3)]],
      score: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[0-9]+$/)]],
      URL: ['', [Validators.required, Validators.minLength(10)]],
    });
    this.userForm.disable();
  }

  ngOnInit(): void {
    this.captureLogin();
  }
  /**
   * funcion que captura el ID del usuario desde la ruta y carga sus datos desde el `localStorage`.
   */
  captureLogin(): void {
    this.route.params.subscribe(params => {
      this.idUser = params['id'];
      this.dataSource = JSON.parse(window.localStorage.getItem('users') || '[]');
      this.usuarioDetail = this.dataSource.find((user) => user.id == this.idUser) || { id: '', login: '', score: '', url: '', avatar: '' };
      this.userForm.patchValue({
        id: this.usuarioDetail.id,
        login: this.usuarioDetail.login,
        score: this.usuarioDetail.score,
        URL: this.usuarioDetail.url
      });
    });
  }

  enableFormFields(): void {
    this.isEditMode = true;
    Object.keys(this.userForm.controls).forEach(controlName => {
      if (controlName !== 'id') {
        this.userForm.get(controlName)?.enable();
      }
    });
  }

    /**
   * Funcion que guarda los cambios realizados en el formulario.
   * Actualiza los datos del usuario en el `localStorage`.
   */
  saveChanges(): void {
    if (this.userForm.valid) {
      const updatedUser = this.userForm.getRawValue();
      const index = this.dataSource.findIndex(user => user.id === updatedUser.id);

      if (index > -1) {
        this.dataSource[index] = { ...this.dataSource[index], ...updatedUser };
        window.localStorage.setItem('users', JSON.stringify(this.dataSource));
        console.log('Cambios guardados:', this.dataSource[index]);
        this.usuarioDetail = this.dataSource[index];
        this.userForm.patchValue({
          id: this.usuarioDetail.id,
          login: this.usuarioDetail.login,
          score: this.usuarioDetail.score,
          URL: this.usuarioDetail.url
        });
        this.isEditMode = false;
        this.userForm.disable();
      } else {
        console.error('Usuario no encontrado en la lista.');
      }
    } else {
      console.error('El formulario no es válido.');
    }
  }

    /**
   * Funcion que cancela la edición del formulario.
   * Restaura los valores originales del usuario y deshabilita el formulario.
   */
  cancelEdit(): void {
    this.isEditMode = false;
    this.userForm.patchValue({
      id: this.usuarioDetail.id,
      login: this.usuarioDetail.login,
      score: this.usuarioDetail.score,
      URL: this.usuarioDetail.url
    });
    this.userForm.disable();
  }
  
  /**
   * Funcion que navega a la pantalla anterior (lista de usuarios).
   */
  goBack(): void {
    this.router.navigate(['/usuarios']);
  }

}

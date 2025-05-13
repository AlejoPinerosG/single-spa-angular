import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

/*
 Componente para la creación de un nuevo usuario, permite al usuario ingresar información como login, 
 score, URL, avatar y guarda los datos en el localStorage.
 */

const LOCAL_STORAGE_KEY = 'users';

@Component({
  selector: 'app-create-user',
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
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})

export class CreateUserComponent {
  userForm: FormGroup;
  avatarPreview: string | ArrayBuffer | null = null;
  selectedFileName: string | null = null;


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
      login: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9]+$/),]],
      score: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[1-9][0-9]*$/),]],
      URL: ['', [Validators.required, Validators.minLength(10), Validators.pattern('https?://.+')]],
      avatar: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.generateUniqueId();
  }

  // Genera un ID único para el usuario y lo asigna al formulario.
  private generateUniqueId(): void {
    const uniqueId = Math.floor(Math.random() * 1_000_000_000);
    this.userForm.patchValue({ id: uniqueId });
  }

  /**
    Maneja la selección de un archivo para el avatar.
    @param event - Evento de cambio del input de archivo.
    */

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validImageTypes.includes(file.type)) {
        console.error('El archivo seleccionado no es una imagen válida.');
        this.userForm.get('avatar')?.setErrors({ invalidFileType: true });
        return;
      }
      this.selectedFileName = file.name;
      this.userForm.patchValue({ avatar: file });
      this.userForm.get('avatar')?.updateValueAndValidity();
      // se genera una vista previa de la imagen seleccionada.
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  //Funcion que maneja el envío del formulario.Si el formulario es válido, guarda el nuevo usuario en el localStorage.
  // Si no es válido, marca todos los campos como tocados para mostrar los errores de validación.
  onSubmit(): void {
    try {
      const users = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      const newUser = {
        avatar: this.avatarPreview,
        id: this.userForm.get('id')?.value,
        login: this.userForm.get('login')?.value,
        score: Number(this.userForm.get('score')?.value),
        url: this.userForm.get('URL')?.value,
      };
      users.push(newUser);
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
      // Reinicia el formulario y navega a la lista de usuarios.
      this.userForm.reset();
      this.avatarPreview = null;
      this.selectedFileName = null;
      this.router.navigate(['/usuarios']);
    } catch (error) {
      console.error('Error al guardar el usuario en el localStorage:', error);
    }
  }

  // Funcion que maneja la acción de cancelar. Reinicia el formulario y genera un nuevo ID único.
  onCancel(): void {
    this.userForm.reset();
    this.avatarPreview = null;
    this.selectedFileName = null;
    this.generateUniqueId();
  }

  //Funcion que navega a la pantalla anterior (lista de usuarios).
  goBack(): void {
    this.router.navigate(['/usuarios']);
  }
}

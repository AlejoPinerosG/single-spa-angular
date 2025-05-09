import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

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

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {

    this.userForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      login: ['', [Validators.required, Validators.minLength(3)]],
      score: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[0-9]+$/)]],
      URL: ['', [Validators.required, Validators.minLength(10), Validators.pattern('https?://.+')]],
      avatar: [null, Validators.required]
    });
  }

    ngOnInit(): void {
    this.generateUniqueId();
  }

private generateUniqueId(): void {
  const uniqueId = Math.floor(Math.random() * 1_000_000_000);
  this.userForm.patchValue({ id: uniqueId });
}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFileName = file.name;
      this.userForm.patchValue({ avatar: file });
      this.userForm.get('avatar')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const users = JSON.parse(window.localStorage.getItem('users') || '[]');
      const newUser = {
        id: this.userForm.get('id')?.value,
        login: this.userForm.get('login')?.value,
        score: this.userForm.get('score')?.value,
        URL: this.userForm.get('URL')?.value,
        avatar: this.avatarPreview // Guardar la vista previa como base64
      };
      users.push(newUser);
      window.localStorage.setItem('users', JSON.stringify(users));
      console.log('Usuario creado:', newUser);
      this.userForm.reset();
      this.avatarPreview = null;
      this.selectedFileName = null;
      this.router.navigate(['/usuarios']);
    } else {
      console.error('El formulario no es válido.');
      this.userForm.markAllAsTouched(); // Marcar todos los campos como "tocados" para mostrar errores
    }
  }

  onCancel(): void {
    this.userForm.reset();
    this.avatarPreview = null;
    this.selectedFileName = null;
    this.generateUniqueId();
  }

  goBack(): void {
    this.router.navigate(['/usuarios']);
  }
}

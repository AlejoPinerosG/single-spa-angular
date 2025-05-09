import { Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { UsersDetailComponent } from './components/users-detail/users-detail.component';
import {CreateUserComponent} from './components/create-user/create-user.component';

export const routes: Routes = [
    { path: 'usuarios', component: UsersComponent },
    {path: 'usuario-detail/:id', component: UsersDetailComponent},
    {path: 'create-user', component: CreateUserComponent},
    { path: '', redirectTo: '/usuarios', pathMatch: 'full' },
    { path: '**', redirectTo: '/usuarios' }
];

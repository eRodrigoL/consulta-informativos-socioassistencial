import { Routes } from '@angular/router';
import { Explore } from './explore';
import { Home } from './home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Consulta de Informativos Socioassistenciais' },
  { path: 'explorar', component: Explore, title: 'Explorar | Consulta de Informativos Socioassistenciais' },
  { path: '**', redirectTo: '' },
];

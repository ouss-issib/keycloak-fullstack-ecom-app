import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './ui/home/home';
import { Products } from './ui/products/products';
import { AuthGuard } from './guards/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home, canActivate: [AuthGuard], data: { role: 'USER' } },
  { path: 'products', component: Products, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

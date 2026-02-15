import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './ui/home/home';
import { Products } from './ui/products/products';
import { AuthGuard } from './guards/auth-guard';
import { OrderDetails } from './ui/order-details/order-details';
import { Orders } from './ui/orders/orders';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home, canActivate: [AuthGuard], data: { role: 'USER' } },
  { path: 'products', component: Products, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: 'orders', component: Orders, canActivate: [AuthGuard], data: { role: 'USER' } },
  { path: 'orders/:id', component: OrderDetails, canActivate: [AuthGuard], data: { role: 'USER' } },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

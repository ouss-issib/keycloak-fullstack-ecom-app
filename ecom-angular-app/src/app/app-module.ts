import { NgModule, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './ui/navbar/navbar';
import { Home } from './ui/home/home';
import { Products } from './ui/products/products';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { initializeKeycloak } from './keycloak-init';
import { Orders } from './ui/orders/orders';
import { CommonModule } from '@angular/common';
import { OrderDetails } from './ui/order-details/order-details';


@NgModule({
  declarations: [
    App,
    Navbar,
    Home,
    Products,
    Orders,
    OrderDetails
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    CommonModule,
    KeycloakAngularModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [App]
})
export class AppModule { }

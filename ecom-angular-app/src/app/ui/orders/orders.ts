import { Component, OnInit, signal } from '@angular/core';
import { Order, OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.html', // <--- MAKE SURE THIS IS CORRECT
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}

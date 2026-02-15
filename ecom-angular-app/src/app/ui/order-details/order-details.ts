import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-details',
  standalone: false,
  templateUrl: './order-details.html', // <--- MAKE SURE THIS IS CORRECT
})
export class OrderDetails implements OnInit {
  order = signal<Order | null>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getOrderById(id).subscribe({
        next: (data) => {
          this.order.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  // This fixes the 'calculateOrderTotal' does not exist error
  calculateOrderTotal(order: Order): number {
    if (!order || !order.productItems) return 0;
    return order.productItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }
}

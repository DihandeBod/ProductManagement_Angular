import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from '../../Services/orders.service';
import { AuthenticationService } from '../../Services/authentication.service';
import { Order } from '../../Models/Order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  orders: Order[] = [];
  statuses: { [key: number]: string } = {}; // Store statuses to avoid fetching multiple times
  showModal: boolean = false;
  orderToUpdate: number | null = null;

  constructor(
    private router: Router, 
    private orderService: OrdersService, 
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders() {
    const vendorEmail = localStorage.getItem('email');
    if (vendorEmail) {
      this.authService.getUserByEmail(vendorEmail).subscribe(
        (userResult: any) => {
          this.orderService.getAllOrders(userResult.id).subscribe(
            (orderResults: Order[]) => {
              this.orders = orderResults;
              this.orders.forEach(order => {
                this.getStatusById(order.orderStatusId!);
              });
            },
            error => {
              console.log('Failed to fetch orders:', error);
            }
          );
        },
        error => {
          console.log('Failed to get user by email:', error);
        }
      );
    }
  }

  getStatusById(id: number) {
    if (!this.statuses[id]) { // Only fetch if status is not already fetched
      this.orderService.getStatusById(id).subscribe(
        (statusResult: any) => {
          this.statuses[id] = statusResult.statusName; // Assuming statusName is returned
        },
        error => {
          console.log('Failed to fetch status:', error);
        }
      );
    }
  }

  openConfirmationModal(orderId: number) {
    this.orderToUpdate = orderId;
    this.showModal = true;
  }

  confirmUpdate() {
    if (this.orderToUpdate !== null) {
      this.orderService.updateOrderStatus(this.orderToUpdate).subscribe(
        () => {
          this.getAllOrders(); // Refresh the orders list after update
          this.closeModal();
        },
        error => {
          console.log('Failed to update order status:', error);
        }
      );
    }
  }

  closeModal() {
    this.showModal = false;
    this.orderToUpdate = null;
  }
    
}

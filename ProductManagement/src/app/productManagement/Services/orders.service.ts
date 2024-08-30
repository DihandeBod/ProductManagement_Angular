import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { Observable } from 'rxjs';
import { Order } from '../Models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = `${environment.baseApiUrl}`;
  private token: string | null = null; 

  constructor(private httpClient: HttpClient) {
    this.token = localStorage.getItem('access_token');
    // console.log(this.token);
   }

   private setHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
  }

  getAllOrders(vendorId: number): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.apiUrl}Vendor/ViewAllAllocatedOrders/${vendorId}`);
  }

  updateOrderStatus(orderId: number): Observable<any>{
    return this.httpClient.put<any>(`${this.apiUrl}Vendor/UpdateOrderStatus/${orderId}`, null);
  }

  getStatusById(statusId: number): Observable<any>{
    return this.httpClient.get<any>(`${this.apiUrl}Vendor/GetStatusById/${statusId}`);
  }
}

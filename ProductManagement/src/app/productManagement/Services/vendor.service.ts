import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { Observable } from 'rxjs';
import { VendorProduct } from '../Models/VendorProduct';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

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

  getVendorProducts(id: number): Observable<VendorProduct[]>{
    return this.httpClient.get<VendorProduct[]>(`${this.apiUrl}Vendor/VendorProducts/${id}`);
  }

  configureProduct(product: any): Observable<VendorProduct>{
    return this.httpClient.put<VendorProduct>(`${this.apiUrl}Vendor/ConfigureProduct`, product);
  }
}

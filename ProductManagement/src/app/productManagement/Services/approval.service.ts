import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { Observable } from 'rxjs';
import { Products } from '../Models/Products';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {

  private apiUrl = `${environment.baseApiUrl}`;
  private token: string | null = null; 
  

  constructor(private httpClient: HttpClient) {
    this.token = localStorage.getItem('access_token');
   }

  private setHeaders(): { headers: HttpHeaders } {
    console.log(this.token);
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
  }

  getAllApprovalProducts() : Observable<Products[]> {
    return this.httpClient.get<Products[]>(`${this.apiUrl}ProductLake/GetAllProductsFromLake`, this.setHeaders());
  }

  approveProduct(id: number) : Observable<Products> {
    return this.httpClient.put<Products>(`${this.apiUrl}ProductLake/ApproveProductUpdate/${id}`, {}, this.setHeaders());
  }

  getDeletedProducts(): Observable<Products[]>{
    return this.httpClient.get<Products[]>(`${this.apiUrl}ProductLake/GetDeletedProducts`, this.setHeaders());
  }
}

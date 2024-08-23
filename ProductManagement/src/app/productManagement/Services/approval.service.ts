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

  constructor(private httpClient: HttpClient) { }

  getAllApprovalProducts() : Observable<Products[]> {
    return this.httpClient.get<Products[]>(`${this.apiUrl}ProductLake/GetAllProductsFromLake`);
  }

  approveProduct(id: number) : Observable<Products> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put<Products>(`${this.apiUrl}ProductLake/ApproveProductUpdate/${id}`, headers);
  }
}

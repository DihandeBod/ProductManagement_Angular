import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Products } from '../Models/Products';
import { ProductCategory } from '../Models/ProductCategory';
import { ProductVM } from '../Models/ProductVM';
import { ProductType } from '../Models/ProductType';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.baseApiUrl}`;

  constructor(private httpClient: HttpClient) { }

  getProducts(): Observable<Products[]> {
    return this.httpClient.get<Products[]>(`${this.apiUrl}Product/GetAllProducts`);
  }

  getProductById(id: number): Observable<Products>{
    return this.httpClient.get<Products>(`${this.apiUrl}Product/GetProductById/${id}`);
  }

  updateProduct(id: number, vm: ProductVM){
    return this.httpClient.put(`${this.apiUrl}/Product/UpdateProduct/${id}`, vm);
  }

  deleteProduct(id: number){
    return this.httpClient.delete(`${this.apiUrl}Product/DeleteProduct/${id}`);
  }

  getCategoryById(id: number): Observable<ProductCategory> {
    return this.httpClient.get<ProductCategory>(`${this.apiUrl}ProductCategory/GetProductCategoryById/${id}`);
  }

  getTypeById(id: number): Observable<ProductType> {
    return this.httpClient.get<ProductType>(`${this.apiUrl}ProductType/GetProductTypeById/${id}`);
  }
}

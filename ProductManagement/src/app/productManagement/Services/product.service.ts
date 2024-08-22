import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  addProduct(prod: ProductVM): Observable<ProductVM>{
    return this.httpClient.post<ProductVM>(`${this.apiUrl}Product/AddProduct`, prod);
  }

  updateProduct(id: number, vm: ProductVM): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put<void>(`${this.apiUrl}Product/UpdateProduct/${id}`, vm, { headers });
  }

  deleteProduct(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}Product/DeleteProduct/${id}`);
  }

  getCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<ProductCategory[]>(`${this.apiUrl}ProductCategory/GetAllProductCategories`);
  }

  getCategoryById(id: number): Observable<ProductCategory> {
    return this.httpClient.get<ProductCategory>(`${this.apiUrl}ProductCategory/GetProductCategoryById/${id}`);
  }

  getTypes(): Observable<ProductType[]> {
    return this.httpClient.get<ProductType[]>(`${this.apiUrl}ProductType/GetAllProductTypes`);
  }

  getTypeById(id: number): Observable<ProductType> {
    return this.httpClient.get<ProductType>(`${this.apiUrl}ProductType/GetProductTypeById/${id}`);
  }
}

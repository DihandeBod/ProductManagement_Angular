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

  getProducts(): Observable<Products[]> {
    return this.httpClient.get<Products[]>(`${this.apiUrl}Product/GetAllProducts`, this.setHeaders());
  }

  getProductById(id: number): Observable<Products>{
    return this.httpClient.get<Products>(`${this.apiUrl}Product/GetProductById/${id}`, this.setHeaders());
  }

  addProduct(prod: ProductVM): Observable<ProductVM>{
    return this.httpClient.post<ProductVM>(`${this.apiUrl}Product/AddProduct`, prod, this.setHeaders());
  }

  updateProduct(id: number, vm: ProductVM): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}Product/UpdateProduct/${id}`, vm, this.setHeaders());
  }

  deleteProduct(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}Product/DeleteProduct/${id}`, this.setHeaders());
  }

  getCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<ProductCategory[]>(`${this.apiUrl}ProductCategory/GetAllProductCategories`, this.setHeaders());
  }

  getCategoryById(id: number): Observable<ProductCategory> {
    return this.httpClient.get<ProductCategory>(`${this.apiUrl}ProductCategory/GetProductCategoryById/${id}`, this.setHeaders());
  }

  getTypes(): Observable<ProductType[]> {
    return this.httpClient.get<ProductType[]>(`${this.apiUrl}ProductType/GetAllProductTypes`, this.setHeaders());
  }

  getTypeById(id: number): Observable<ProductType> {
    return this.httpClient.get<ProductType>(`${this.apiUrl}ProductType/GetProductTypeById/${id}`, this.setHeaders());
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { ProductService } from '../../Services/product.service';
import { Products } from '../../Models/Products';
import { ProductCategory } from '../../Models/ProductCategory';
import { error } from 'console';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products: Products[] = [];
  categories: ProductCategory = new ProductCategory();
  product: Products = new Products();
  displayedColumns: string[] = ['productName', 'productDescription', 'productCategoryId', 'edit', 'delete'];

  constructor(private dataService: ProductService) { }

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.dataService.getProducts().subscribe(
      (result: any) => {
        this.products = result;
      },
      (error: any) => {
        console.error("Request failed with error:", error);
      }
    );
  }

  onAdd() {
    // Logic to add a new product
  }

  onEdit(product: Products) {
    // Logic to edit a product
  }

  onDelete(product: Products) {
    // Logic to delete a product
  }
}

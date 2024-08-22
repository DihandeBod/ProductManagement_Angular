import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { ProductService } from '../../Services/product.service';
import { Products } from '../../Models/Products';
import { ProductCategory } from '../../Models/ProductCategory';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ProductVM } from '../../Models/ProductVM';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatTableModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatIconModule, 
    MatSelectModule, 
    MatButtonModule,
    MatIconModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  // Products
  products: Products[] = [];
  newProduct: ProductVM = {
    productId: undefined,
    productName: '',
    productDescription: '',
    isDeleted: false,  // Default to false
    isApproved: false, // Default to false
    productCategoryId: undefined
  };
  
  product: Products = new Products();

  // Categories
  categories: ProductCategory[] = [];
  
  // Table and modals
  displayedColumns: string[] = ['productName', 'productDescription', 'productCategoryName', 'edit', 'delete'];
  displayStyle: string = "none";
  displayDeleteStyle: string = "none";
  isEditMode: boolean = false;
  productToDelete: Products | null = null;

  constructor(private dataService: ProductService) { }

  ngOnInit() {
    this.getAllCategories();
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

  getAllCategories(){
    this.dataService.getCategories().subscribe((result: any) => {
      this.categories = result;
    },
    (error: any) => {
      console.log(error);
    })
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.productCategoryId === categoryId);
    return category?.productCategoryName || 'Unknown';
  }
  
  addProduct(){
    this.dataService.addProduct(this.newProduct).subscribe((result: any) => {

      this.newProduct.productCategoryId = parseInt(this.newProduct.productCategoryId as any, 10);
      this.newProduct.isDeleted = false;
      this.newProduct.isApproved = false;

      console.log("Added");
      this.closeAddModal();
    },
  (error: any) => {
    console.log("Not added");
  })
  }

  updateProduct() {
    this.dataService.updateProduct(this.newProduct.productId!, this.newProduct).subscribe(
      (result: any) => {
        const index = this.products.findIndex(p => p.productId === this.newProduct.productId);
        if (index !== -1) {
          this.products[index] = { ...result };
        }
        this.closeAddModal();
      },
      (error: any) => console.log("Not updated")
    );
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.dataService.deleteProduct(this.productToDelete.productId!).subscribe(
        () => {
          this.products = this.products.filter(p => p.productId !== this.productToDelete?.productId);
          this.closeDeleteModal();
        },
        (error: any) => console.error("Failed to delete product:", error)
      );
    }
  }


  openAddModal() {
    this.isEditMode = false;
    this.newProduct = {
      productId: undefined,
      productName: '',
      productDescription: '',
      isDeleted: false,
      isApproved: false,
      productCategoryId: undefined
    };
    this.displayStyle = "block";
  }

  openEditModal(product: Products) {
    this.isEditMode = true;
    this.newProduct = { ...product };
    console.log('Editing Product ID:', product.productId);
    this.displayStyle = "block";
  }

  openDeleteModal(product: Products) {
    this.productToDelete = product;
    this.displayDeleteStyle = "block";
  }

  closeDeleteModal() {
    this.displayDeleteStyle = "none";
    this.productToDelete = null;
  }
  

  closeAddModal() {
    this.displayStyle = "none";
  }

  saveProduct() {
    if (this.isEditMode) {
      this.updateProduct();
      location.reload();
    } else {
      this.addProduct();
    }
  }
}

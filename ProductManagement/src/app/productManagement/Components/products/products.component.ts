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
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../Services/authentication.service';

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
    MatIconModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  // Products
  products: Products[] = [];
  newProduct: ProductVM = {
    productId: undefined,
    productName: '',
    productDescription: '',
    isDeleted: false, // Default to false
    isApproved: false, // Default to false
    productCategoryId: undefined,
  };

  product: Products = new Products();

  // Categories
  categories: ProductCategory[] = [];

  // Table and modals
  displayedColumns: string[] = [
    'productName',
    'productDescription',
    'productCategoryName',
    'edit',
    'delete',
  ];
  displayStyle: string = 'none';
  displayDeleteStyle: string = 'none';
  isEditMode: boolean = false;
  productToDelete: Products | null = null;
  isFormValid: boolean = false;
  isFormChanged: boolean = false;
  originalProduct: Products = new Products();

  // Ease of use
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedProducts: Products[] = [];
  Math: any;

  constructor(private dataService: ProductService, private route: ActivatedRoute, private authService: AuthenticationService) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
      this.authService.handleAuthCallback(code);
      }
    }
    this.getAllCategories();
    this.getAllProducts();
  }

  getAllProducts() {
    this.dataService.getProducts().subscribe(
      (result: any) => {
        this.products = result;
        this.updatePagination();
      },
      (error: any) => {
        console.error('Request failed with error:', error);
      }
    );
  }

  getAllCategories() {
    this.dataService.getCategories().subscribe(
      (result: any) => {
        this.categories = result;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(
      (cat) => cat.productCategoryId === categoryId
    );
    return category?.productCategoryName || 'Unknown';
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.products
      .filter(
        (product) =>
          product
            .productName!.toLowerCase()
            .includes(this.searchText.toLowerCase()) ||
          product
            .productDescription!.toLowerCase()
            .includes(this.searchText.toLowerCase()) ||
          this.getCategoryName(product.productCategoryId!)
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
      )
      .slice(startIndex, endIndex);
  }

  addProduct() {
    this.dataService.addProduct(this.newProduct).subscribe(
      (result: any) => {
        this.newProduct.productCategoryId = parseInt(
          this.newProduct.productCategoryId as any,
          10
        );
        this.newProduct.isDeleted = false;
        this.newProduct.isApproved = false;

        console.log('Added');
        this.closeAddModal();
      },
      (error: any) => {
        console.log('Not added');
      }
    );
  }

  updateProduct() {
    this.dataService
      .updateProduct(this.newProduct.productId!, this.newProduct)
      .subscribe(
        (result: any) => {
          const index = this.products.findIndex(
            (p) => p.productId === this.newProduct.productId
          );
          if (index !== -1) {
            this.products[index] = { ...result };
          }
          this.closeAddModal();
        },
        (error: any) => console.log('Not updated')
      );
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.dataService.deleteProduct(this.productToDelete.productId!).subscribe(
        () => {
          this.products = this.products.filter(
            (p) => p.productId !== this.productToDelete?.productId
          );
          this.getAllProducts();
          this.closeDeleteModal();
        },
        (error: any) => console.error('Failed to delete product:', error)
      );
    }
  }

  onSearchChange() {
    this.currentPage = 1; // Reset to first page when searching
    this.updatePagination();
  }

  onPageChange(page: number) {
    page = Math.ceil(page);
    this.currentPage = page;
    this.updatePagination();
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1; // Reset to first page when items per page changes
    this.updatePagination();
  }

  openAddModal() {
    this.isEditMode = false;
    this.newProduct = {
      productId: undefined,
      productName: '',
      productDescription: '',
      isDeleted: false,
      isApproved: false,
      productCategoryId: undefined,
    };
    this.displayStyle = 'block';
  }

  openEditModal(product: Products) {
    this.isEditMode = true;
    this.newProduct = { ...product };
    this.originalProduct = { ...product }; // Store original product to detect changes
    this.isFormChanged = false;
    this.displayStyle = 'block';
    this.checkFormValidity();
  }

  openDeleteModal(product: Products) {
    this.productToDelete = product;
    this.displayDeleteStyle = 'block';
  }

  closeDeleteModal() {
    this.displayDeleteStyle = 'none';
    this.productToDelete = null;
  }

  closeAddModal() {
    this.displayStyle = 'none';
  }

  saveProduct() {
    if (this.isEditMode) {
      this.dataService
        .updateProduct(this.newProduct.productId!, this.newProduct)
        .subscribe(() => {
          this.getAllProducts();
          this.closeAddModal();
          location.reload();
        });
    } else {
      this.dataService.addProduct(this.newProduct).subscribe(() => {
        this.getAllProducts();
        this.closeAddModal();
        location.reload();
      });
    }
  }

  checkFormValidity() {
    this.isFormValid =
      !!this.newProduct.productName?.trim() &&
      !!this.newProduct.productDescription?.trim() &&
      !!this.newProduct.productCategoryId;
  
    if (this.isEditMode) {
      this.isFormChanged =
        this.newProduct.productName !== this.originalProduct.productName ||
        this.newProduct.productDescription !== this.originalProduct.productDescription ||
        this.newProduct.productCategoryId !== this.originalProduct.productCategoryId;
    } else {
      this.isFormChanged = this.isFormValid;
    }
  }
  
}

import { Component } from '@angular/core';
import { Products } from '../../Models/Products';
import { Router } from '@angular/router';
import { ApprovalService } from '../../Services/approval.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCategory } from '../../Models/ProductCategory';
import { ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css'],
})
export class ApprovalComponent {
  products: Products[] = [];
  deletedProducts: Products[] = [];
  categories: ProductCategory[] = [];
  filteredProducts: Products[] = [];
  filteredDeletedProducts: Products[] = [];
  paginatedProducts: Products[] = [];
  paginatedDeletedProducts: Products[] = [];
  prodIdToUpdate: number = 0;
  showDeletedProducts = false;

  // Search criteria
  searchText: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Modal
  displayStyle: string = 'none';
  confirmationText: string = '';

  constructor(private router: Router, private dataService: ApprovalService, private productDataService: ProductService) {}

  ngOnInit() {
    this.getAllCategories();
    this.getProductsFromLake();
    this.getDeletedProductFromLake();
  }

  getProductsFromLake() {
    this.dataService.getAllApprovalProducts().subscribe(
      (result: any) => {
        this.products = result;
        this.filteredProducts = this.products;
        this.updatePagination();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getDeletedProductFromLake(){
    this.dataService.getDeletedProducts().subscribe((result:any) => {
      this.deletedProducts = result;
      this.filteredDeletedProducts = this.deletedProducts;
    },
  (error: any) => {
    console.log(error);
  })
  }

  onSearchChange() {
    this.currentPage = 1; // Reset to first page when searching
    if (this.showDeletedProducts) {
      this.filteredDeletedProducts = this.deletedProducts.filter(product =>
        product.productName!.toLowerCase().includes(this.searchText.toLowerCase()) ||
        product.productDescription!.toLowerCase().includes(this.searchText.toLowerCase()) ||
        this.getCategoryName(product.productCategoryId!).toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.productName!.toLowerCase().includes(this.searchText.toLowerCase()) ||
        product.productDescription!.toLowerCase().includes(this.searchText.toLowerCase()) ||
        this.getCategoryName(product.productCategoryId!).toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    this.updatePagination();
  }

  getAllCategories() {
    this.productDataService.getCategories().subscribe(
      (result: any) => {
        this.categories = result;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.productCategoryId === categoryId);
    return category?.productCategoryName || 'Unknown';
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    if (this.showDeletedProducts) {
      this.paginatedDeletedProducts = this.filteredDeletedProducts.slice(startIndex, endIndex);
    } else {
      this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
    }
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

  openModal(productId: number) {
    this.displayStyle = 'block';
    this.prodIdToUpdate = productId;
  }

  closeModal() {
    this.displayStyle = 'none';
    this.prodIdToUpdate = 0;
    this.confirmationText = '';
  }

  confirmApproval() {
    if (this.confirmationText === 'Confirm') {
      this.dataService.approveProduct(this.prodIdToUpdate).subscribe(
        (result: any) => {
          console.log('Product approved');
          this.getProductsFromLake();
          this.closeModal();
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  toText(is: boolean): string {
    return is ? 'True' : 'False';
  }

  toggleTableView() {
    this.showDeletedProducts = !this.showDeletedProducts;
    this.onSearchChange(); // Optional: to reset the search or pagination when switching views
  }
}

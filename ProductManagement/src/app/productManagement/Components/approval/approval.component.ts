import { Component } from '@angular/core';
import { Products } from '../../Models/Products';
import { Router } from '@angular/router';
import { ApprovalService } from '../../Services/approval.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCategory } from '../../Models/ProductCategory';
import { ProductService } from '../../Services/product.service';
import Swal from 'sweetalert2';

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

  constructor( private router: Router, private dataService: ApprovalService, private productDataService: ProductService ) {}

  ngOnInit() {
    this.getAllCategories();
    this.getProductsFromLake();
    this.getDeletedProductsFromLake();
  }

  getProductsFromLake() {
    this.dataService.getAllApprovalProducts().subscribe(
      (result: any) => {
        this.products = result;
        this.filteredProducts = this.products;
        this.currentPage = Math.min(this.currentPage, Math.ceil(this.filteredProducts.length / this.itemsPerPage) || 1);
        this.updatePagination();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  
  getDeletedProductsFromLake() {
    this.dataService.getDeletedProducts().subscribe(
      (result: any) => {
        this.deletedProducts = result;
        this.filteredDeletedProducts = this.deletedProducts;
        this.currentPage = Math.min(this.currentPage, Math.ceil(this.filteredDeletedProducts.length / this.itemsPerPage) || 1);
        this.updatePagination();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onSearchChange() {
    this.currentPage = 1; 
    if (this.showDeletedProducts) {
      this.filteredDeletedProducts = this.deletedProducts.filter((product) =>
        this.doesProductMatchSearch(product)
      );
    } else {
      this.filteredProducts = this.products.filter((product) =>
        this.doesProductMatchSearch(product)
      );
    }
    this.updatePagination();
  }

  doesProductMatchSearch(product: Products): boolean {
    return (
      product.productName!.toLowerCase().includes(this.searchText.toLowerCase()) ||
      product.productDescription!.toLowerCase().includes(this.searchText.toLowerCase()) ||
      this.getCategoryName(product.productCategoryId!).toLowerCase().includes(this.searchText.toLowerCase())
    );
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
    const category = this.categories.find((cat) => cat.productCategoryId === categoryId);
    return category?.productCategoryName || 'Unknown';
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
  
    if (this.showDeletedProducts) {
      if (this.filteredDeletedProducts.length <= startIndex && this.currentPage > 1) {
        this.currentPage = Math.max(1, this.currentPage - 1);
        this.updatePagination(); // Recurse to update the page after adjusting the current page
      } else {
        this.paginatedDeletedProducts = this.filteredDeletedProducts.slice(startIndex, endIndex);
      }
    } else {
      if (this.filteredProducts.length <= startIndex && this.currentPage > 1) {
        this.currentPage = Math.max(1, this.currentPage - 1);
        this.updatePagination(); // Recurse to update the page after adjusting the current page
      } else {
        this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
      }
    }
  }

  onPageChange(page: number) {
    this.currentPage = Math.ceil(page);
    this.updatePagination();
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1; 
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
          this.getDeletedProductsFromLake();
          this.updatePagination(); // Make sure pagination is updated
          Swal.fire("Success", "Product successfully updated", "success");
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
    this.currentPage = 1; 
    this.updatePagination(); 
  }
}

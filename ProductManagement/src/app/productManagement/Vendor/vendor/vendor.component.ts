import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VendorService } from '../../Services/vendor.service';
import { AuthenticationService } from '../../Services/authentication.service';
import { ProductService } from '../../Services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.css',
})
export class VendorComponent {
  constructor(
    private router: Router,
    private dataService: VendorService,
    private authService: AuthenticationService,
    private productService: ProductService
  ) {}

  vendorProducts: any[] = [];
  products: any[] = [];
  selectedProduct: any = null; 
  showEditModal: boolean = false; 

  ngOnInit() {
    this.getVendorProducts();
  }

  getVendorProducts() {
    var vendorEmail = localStorage.getItem('email');
    // console.log(vendorEmail);
    this.authService.getUserByEmail(vendorEmail!).subscribe(
      (result: any) => {
        this.dataService.getVendorProducts(result.id).subscribe(
          (result: any) => {
            this.vendorProducts = result;
            this.populateProducts();
          },
          (error: any) => {
            console.log('Failed');
          }
        );
      },
      (error: any) => {
        console.log('Failed man');
      }
    );
  }

  populateProducts() {
    this.products = []; // Clear the products array to prevent duplicates
    this.vendorProducts.forEach(vp => {
      this.productService.getProductById(vp.productId).subscribe(
        (product: any) => {
          // Check if the product is already in the products array before adding
          const existingProductIndex = this.products.findIndex(p => p.productId === vp.productId && p.vendorId === vp.vendorId);
          if (existingProductIndex === -1) {
            this.products.push({ ...vp, productName: product.productName }); // Add the product if it doesn't exist
          }
        },
        (error: any) => {
          console.log('Failed to get product by ID', error);
        }
      );
    });
  }

  onEditProduct(product: any) {
    // Use vendorId and productId to uniquely identify which vendorProduct to update
    const updatedProduct = {
      vendorId: this.selectedProduct.vendorId,
      productId: this.selectedProduct.productId,
      price: product.price || this.selectedProduct.price,
      stockCount: product.quantityOnHand || this.selectedProduct.quantityOnHand,
      stockLimit: product.stockLimit || this.selectedProduct.stockLimit
    };
    this.dataService.configureProduct(updatedProduct)
    .subscribe((response:any) => 
      {
      console.log('Product updated successfully', response);
      this.getVendorProducts();
      this.closeEditModal();
    }, (error: any) => {
      console.log("Error: " + error);
    });
  }

  openEditModal(product: any): void {
    this.selectedProduct = { ...product }; // Clone the product to avoid direct mutation
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedProduct = null;
  }
}

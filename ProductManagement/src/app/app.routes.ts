import { Routes } from '@angular/router';
import { LoginComponent } from './productManagement/Components/login/login.component';
import { ProductsComponent } from './productManagement/Components/products/products.component';
import { ApprovalComponent } from './productManagement/Components/approval/approval.component';
import { authGuard } from './productManagement/Authentication/auth.guard';
import { VendorComponent } from './productManagement/Vendor/vendor/vendor.component';
import { CustomerComponent } from './productManagement/Customer/customer/customer.component';
import { OrdersComponent } from './productManagement/Vendor/orders/orders.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'products', component: ProductsComponent, canActivate: [authGuard], data: { role: ['Product Manager', 'Product Capturer'] } },
    { path: 'approval', component: ApprovalComponent, canActivate: [authGuard], data: { role: ['Product Manager'] } },
    { path: 'vendor', component: VendorComponent, canActivate: [authGuard], data: { role: ['Vendor'] } },
    { path: 'orders', component: OrdersComponent, canActivate: [authGuard], data: { role: ['Vendor'] } },
    { path: 'customer', component: CustomerComponent, canActivate: [authGuard], data: { role: ['Customer'] } }
];
import { Routes } from '@angular/router';
import { LoginComponent } from './productManagement/Components/login/login.component';
import { ProductsComponent } from './productManagement/Components/products/products.component';
import { ApprovalComponent } from './productManagement/Components/approval/approval.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'products', component: ProductsComponent},
    {path: 'approval', component: ApprovalComponent}
    
];

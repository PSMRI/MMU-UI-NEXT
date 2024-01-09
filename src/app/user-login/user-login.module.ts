import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app-modules/core/material.module';
import { LoginComponent } from './login/login.component';
import { MatIconModule } from '@angular/material/icon';
import { DataSyncLoginComponent } from './data-sync-login/data-sync-login.component';

@NgModule({
  declarations: [LoginComponent, DataSyncLoginComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, MatIconModule],
  exports: [LoginComponent],
})
export class UserLoginModule {}
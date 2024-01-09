/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { NgModule, ErrorHandler, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerService } from './services/spinner.service';
import { ConfirmationService } from './services/confirmation.service';
import { CameraService } from './services/camera.service';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { BeneficiaryDetailsService } from './services/beneficiary-details.service';
import { CommonService } from './services/common-services.service';
import { InventoryService } from './services/inventory.service';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from './components/common-dialog/common-dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // ChartsModule,
    // WebCamModule,
    // PaginationModule.forRoot()
  ],
  declarations: [
    CommonDialogComponent,
    // CameraDialogComponent,
    // ProvisionalSearchComponent,
    // TextareaDialogComponent,
    // SpinnerComponent,
    // BeneficiaryDetailsComponent,
    // AppFooterComponent,
    // AppHeaderComponent,
    // PreviousDetailsComponent,
    // ShowCommitAndVersionDetailsComponent,CalibrationComponent,
    // myEmail, myMobileNumber, OpenModalDirective, ConfirmatoryDiagnosisDirective, myName, myPassword, StringValidator, NullDefaultValueDirective, NumberValidator, DisableFormControlDirective,
    // ViewRadiologyUploadedFilesComponent, IotcomponentComponent,IotBluetoothComponent,AllergenSearchComponent, DataSyncLoginComponent,OpenPreviousVisitDetailsComponent,
    // SetLanguageComponent
  ],
  exports: [
    MaterialModule,
    CommonDialogComponent,
    // CameraDialogComponent,
    // TextareaDialogComponent,
    // SpinnerComponent,
    // BeneficiaryDetailsComponent,
    // AppFooterComponent,
    // AppHeaderComponent,
    // PreviousDetailsComponent,
    // PaginationModule, ShowCommitAndVersionDetailsComponent,
    // myEmail, myMobileNumber, OpenModalDirective, ConfirmatoryDiagnosisDirective, myName, myPassword, DisableFormControlDirective, StringValidator, NumberValidator, NullDefaultValueDirective,
    // IotcomponentComponent,
    // IotBluetoothComponent,AllergenSearchComponent, DataSyncLoginComponent,CalibrationComponent,OpenPreviousVisitDetailsComponent
  ],
  // entryComponents: [
  //   CommonDialogComponent,
  //   CameraDialogComponent,
  //   TextareaDialogComponent,
  //   SpinnerComponent,
  //   PreviousDetailsComponent,
  //   ProvisionalSearchComponent,
  //   ShowCommitAndVersionDetailsComponent,
  //   ViewRadiologyUploadedFilesComponent,
  //   IotcomponentComponent,
  //   IotBluetoothComponent,
  //   AllergenSearchComponent,
  //   DataSyncLoginComponent,CalibrationComponent,
  //   OpenPreviousVisitDetailsComponent
  // ]
})
export class CoreModule {

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ConfirmationService,
        CameraService,
        // TextareaDialog,
        AuthGuard,
        AuthService,
        SpinnerService,
        BeneficiaryDetailsService,
        CommonService,
        InventoryService,
        // CanDeactivateGuardService,
        // MasterdataService,
        // HttpServiceService,
        // IotService,
        // {
        //   provide: Http,
        //   useFactory: HttpInterceptorFactory,
        //   deps: [XHRBackend, RequestOptions, Router, SpinnerService, ConfirmationService]
        // }
      ]
    };
  }
}

// export function HttpInterceptorFactory(backend: XHRBackend, options: RequestOptions, router: Router, spinner: SpinnerService, confirmation: ConfirmationService) {
//   return new HttpInterceptor(backend, options, router, spinner, confirmation);
// }

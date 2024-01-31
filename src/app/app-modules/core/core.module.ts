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
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { CommonDialogComponent } from './components/common-dialog/common-dialog.component';
import { SetLanguageComponent } from './components/set-language.component';
import {
  ConfirmationService,
  CameraService,
  AuthService,
  SpinnerService,
  BeneficiaryDetailsService,
} from './services';
import { AuthGuard } from './services/auth-guard.service';
import { CommonService } from './services/common-services.service';
import { HttpServiceService } from './services/http-service.service';
import { InventoryService } from './services/inventory.service';
import { IotService } from './services/iot.service';
import { CameraDialogComponent } from './components/camera-dialog/camera-dialog.component';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // ChartsModule,
    WebcamModule,
    // PaginationModule.forRoot()
  ],
  declarations: [
    CommonDialogComponent,
    CameraDialogComponent,
    // ProvisionalSearchComponent,
    // TextareaDialogComponent,
    // SpinnerComponent,
    // BeneficiaryDetailsComponent,
    AppFooterComponent,
    AppHeaderComponent,
    // PreviousDetailsComponent,
    // ShowCommitAndVersionDetailsComponent,CalibrationComponent,
    // myEmail, myMobileNumber, OpenModalDirective, ConfirmatoryDiagnosisDirective, myName, myPassword, StringValidator, NullDefaultValueDirective, NumberValidator, DisableFormControlDirective,
    // ViewRadiologyUploadedFilesComponent, IotcomponentComponent,IotBluetoothComponent,AllergenSearchComponent, DataSyncLoginComponent,OpenPreviousVisitDetailsComponent,
  ],
  exports: [
    MaterialModule,
    CommonDialogComponent,
    AppFooterComponent,
    AppHeaderComponent,
    // IotBluetoothComponent,
    // ShowCommitAndVersionDetailsComponent,
    CameraDialogComponent,
    // TextareaDialogComponent,
    // SpinnerComponent,
    // BeneficiaryDetailsComponent,
    // AppFooterComponent,
    // AppHeaderComponent,
    // PreviousDetailsComponent,
    // PaginationModule,
    // myEmail, myMobileNumber, OpenModalDirective, ConfirmatoryDiagnosisDirective, myName, myPassword, DisableFormControlDirective, StringValidator, NumberValidator, NullDefaultValueDirective,
    // IotcomponentComponent,
    // AllergenSearchComponent, DataSyncLoginComponent,CalibrationComponent,OpenPreviousVisitDetailsComponent
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
  // IotBluetoothComponent,
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
        SetLanguageComponent,
        // CanDeactivateGuardService,
        // MasterdataService,
        HttpServiceService,
        IotService,
        // {
        //   provide: Http,
        //   useFactory: HttpInterceptorFactory,
        //   deps: [XHRBackend, RequestOptions, Router, SpinnerService, ConfirmationService]
        // }
      ],
    };
  }
}

// export function HttpInterceptorFactory(backend: XHRBackend, options: RequestOptions, router: Router, spinner: SpinnerService, confirmation: ConfirmationService) {
//   return new HttpInterceptor(backend, options, router, spinner, confirmation);
// }

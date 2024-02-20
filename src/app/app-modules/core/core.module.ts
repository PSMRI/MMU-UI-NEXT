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
import { WebcamImage, WebcamInitError, WebcamModule } from 'ngx-webcam';
import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';
import { BeneficiaryDetailsComponent } from './components/beneficiary-details/beneficiary-details.component';
import { ViewRadiologyUploadedFilesComponent } from './components/view-radiology-uploaded-files/view-radiology-uploaded-files.component';
import { PreviousDetailsComponent } from './components/previous-details/previous-details.component';
import { MatTableModule } from '@angular/material/table';
import { IotcomponentComponent } from './components/iotcomponent/iotcomponent.component';
import { CalibrationComponent } from './components/calibration/calibration.component';
import { ProvisionalSearchComponent } from './components/provisional-search/provisional-search.component';
import { ConfirmatoryDiagnosisDirective } from './directives/confirmatory-diagnosis.directive';
import { DisableFormControlDirective } from './directives/disableFormControl.directive';
import { NullDefaultValueDirective } from './directives/null-default-value.directive';
import { OpenModalDirective } from './directives/open-modal.directive';
import { AllergenSearchComponent } from './components/allergen-search/allergen-search.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { StringValidatorDirective } from './directives/stringValidator.directive';
import { myPasswordDirective } from './directives/password/myPassword.directive';
import { NumberValidatorDirective } from './directives/numberValidator.directive';
import { myNameDirective } from './directives/name/myName.directive';
import { myMobileNumberDirective } from './directives/MobileNumber/myMobileNumber.directive';
import { myEmailDirective } from './directives/email/myEmail.directive';

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
    MatTableModule,
    // PaginationModule.forRoot()
  ],
  declarations: [
    CommonDialogComponent,
    CameraDialogComponent,
    ProvisionalSearchComponent,
    // TextareaDialogComponent,
    SpinnerComponent,
    BeneficiaryDetailsComponent,
    AppFooterComponent,
    AppHeaderComponent,
    ViewRadiologyUploadedFilesComponent,
    // PreviousDetailsComponent,
    PreviousDetailsComponent,
    // ShowCommitAndVersionDetailsComponent,
    CalibrationComponent,
    myEmailDirective,
    myMobileNumberDirective,
    OpenModalDirective,
    ConfirmatoryDiagnosisDirective,
    myNameDirective,
    myPasswordDirective,
    StringValidatorDirective,
    NullDefaultValueDirective,
    NumberValidatorDirective,
    DisableFormControlDirective,
    // ViewRadiologyUploadedFilesComponent,
    IotcomponentComponent,
    // IotBluetoothComponent,
    AllergenSearchComponent,
    // OpenPreviousVisitDetailsComponent,
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
    SpinnerComponent,
    BeneficiaryDetailsComponent,
    // AppFooterComponent,
    // AppHeaderComponent,
    PreviousDetailsComponent,
    // PaginationModule,
    myEmailDirective,
    myMobileNumberDirective,
    OpenModalDirective,
    ConfirmatoryDiagnosisDirective,
    myNameDirective,
    myPasswordDirective,
    DisableFormControlDirective,
    StringValidatorDirective,
    NumberValidatorDirective,
    NullDefaultValueDirective,
    IotcomponentComponent,
    AllergenSearchComponent,
    CalibrationComponent,
    //OpenPreviousVisitDetailsComponent
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
  // IotcomponentComponent,
  // IotBluetoothComponent,
  //   AllergenSearchComponent,
  //   DataSyncLoginComponent,
  // CalibrationComponent,
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
        CanDeactivateGuardService,
        // MasterdataService,
        HttpServiceService,
        IotService,
        {
          provide: [WebcamImage, WebcamInitError],
          useClass: WebcamModule,
        },
        // {
        //   provide: Http,
        //   useFactory: HttpInterceptorFactory,
        //   deps: [XHRBackend, RequestOptions, Router, SpinnerService, ConfirmationService]
        // }
      ],
    };
  }
}

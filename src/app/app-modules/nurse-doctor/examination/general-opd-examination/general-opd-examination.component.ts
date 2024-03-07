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

import {
  Component,
  OnInit,
  Input,
  DoCheck,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { DoctorService } from '../../shared/services';
import { SetLanguageComponent } from 'src/app/app-modules/core/components/set-language.component';
import { HttpServiceService } from 'src/app/app-modules/core/services/http-service.service';

@Component({
  selector: 'app-nurse-general-opd-examination',
  templateUrl: './general-opd-examination.component.html',
  styleUrls: ['./general-opd-examination.component.css'],
})
export class GeneralOpdExaminationComponent
  implements OnInit, DoCheck, OnDestroy, OnChanges
{
  @Input()
  visitCategory!: string;

  @Input()
  patientExaminationForm!: FormGroup;

  @Input()
  mode!: string;
  languageComponent!: SetLanguageComponent;
  currentLanguageSet: any;
  generalExaminationForm!: FormGroup;
  headToToeExaminationForm!: FormGroup;
  systemicExaminationForm!: FormGroup;

  constructor(
    private httpServiceService: HttpServiceService,
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.fetchLanguageResponse();
    this.generalExaminationForm = this.patientExaminationForm.get(
      'generalExaminationForm'
    ) as FormGroup;
    this.headToToeExaminationForm = this.patientExaminationForm.get(
      'headToToeExaminationForm'
    ) as FormGroup;
    this.systemicExaminationForm = this.patientExaminationForm.get(
      'systemicExaminationForm'
    ) as FormGroup;
  }

  ngOnDestroy() {
    if (this.ancExaminationDataSubscription)
      this.ancExaminationDataSubscription.unsubscribe();
  }

  ngOnChanges() {
    if (this.mode == 'view') {
      const visitID = localStorage.getItem('visitID');
      const benRegID = localStorage.getItem('beneficiaryRegID');
      this.getAncExaminationData(benRegID, visitID);
    }
    if (this.mode == 'update') {
      this.updatePatientExamination(this.patientExaminationForm);
    }
  }

  checkRequired(patientExaminationForm: any) {
    const required = [];
    const generalExaminationForm = <FormGroup>(
      patientExaminationForm.controls['generalExaminationForm']
    );
    if (generalExaminationForm.controls['typeOfDangerSigns'].errors) {
      required.push(
        this.currentLanguageSet.ExaminationData.ANC_OPD_PNCExamination
          .genExamination.dangersigns
      );
    }
    if (generalExaminationForm.controls['lymphnodesInvolved'].errors) {
      required.push(
        this.currentLanguageSet.ExaminationData.ANC_OPD_PNCExamination
          .genExamination.lymph
      );
    }
    if (generalExaminationForm.controls['typeOfLymphadenopathy'].errors) {
      required.push(
        this.currentLanguageSet.ExaminationData.ANC_OPD_PNCExamination
          .genExamination.typeofLymphadenopathy
      );
    }
    if (generalExaminationForm.controls['extentOfEdema'].errors) {
      required.push(
        this.currentLanguageSet.ExaminationData.ANC_OPD_PNCExamination
          .genExamination.extentofEdema
      );
    }
    if (generalExaminationForm.controls['edemaType'].errors) {
      required.push(
        this.currentLanguageSet.ExaminationData.ANC_OPD_PNCExamination
          .genExamination.typeofEdema
      );
    }
    if (required.length) {
      this.confirmationService.notify(
        this.currentLanguageSet.alerts.info.mandatoryFields,
        required
      );
      return false;
    } else {
      return true;
    }
  }
  updatePatientExamination(patientExaminationForm: any) {
    if (this.checkRequired(patientExaminationForm)) {
      const serviceLineDetails: any =
        localStorage.getItem('serviceLineDetails');
      const vanID = JSON.parse(serviceLineDetails).vanID;
      const parkingPlaceID = JSON.parse(serviceLineDetails).parkingPlaceID;
      const updateDetails = {
        beneficiaryRegID: localStorage.getItem('beneficiaryRegID'),
        benVisitID: localStorage.getItem('visitID'),
        providerServiceMapID: localStorage.getItem('providerServiceID'),
        modifiedBy: localStorage.getItem('userName'),
        beneficiaryID: localStorage.getItem('beneficiaryID'),
        sessionID: localStorage.getItem('sessionID'),
        parkingPlaceID: parkingPlaceID,
        vanID: vanID,
        benFlowID: localStorage.getItem('benFlowID'),
        visitCode: localStorage.getItem('visitCode'),
      };

      this.doctorService
        .updatePatientExamination(
          patientExaminationForm.value,
          this.visitCategory,
          updateDetails
        )
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              this.confirmationService.alert(
                'Examination updated successfully',
                'success'
              );
              this.patientExaminationForm.markAsPristine();
            } else {
              this.confirmationService.alert(
                'Error in Examination update',
                'error'
              );
            }
          },
          err => {
            this.confirmationService.alert(
              'Error in Examination update',
              'error'
            );
          }
        );
    }
  }

  ancExaminationDataSubscription: any;
  getAncExaminationData(benRegID: any, visitID: any) {
    this.ancExaminationDataSubscription = this.doctorService
      .getGeneralExamintionData(benRegID, visitID)
      .subscribe(examinationData => {
        if (examinationData.statusCode == 200 && examinationData.data) {
          console.log(
            'examinationData.data',
            JSON.stringify(examinationData.data, null, 4)
          );
          const temp = examinationData.data;

          if (this.visitCategory == 'ANC') {
            const ancFormData = Object.assign({
              generalExaminationForm: temp.generalExamination,
              headToToeExaminationForm: temp.headToToeExamination,
              systemicExaminationForm: Object.assign({
                cardioVascularSystemForm: temp.cardiovascularExamination,
                respiratorySystemForm: temp.respiratoryExamination,
                centralNervousSystemForm: temp.centralNervousExamination,
                musculoSkeletalSystemForm: temp.musculoskeletalExamination,
                genitoUrinarySystemForm: temp.genitourinaryExamination,
                obstetricExaminationForANCForm: temp.obstetricExamination,
              }),
            });
            this.patientExaminationForm.patchValue(ancFormData);
          }

          if (this.visitCategory == 'PNC') {
            const ancFormData = Object.assign({
              generalExaminationForm: temp.generalExamination,
              headToToeExaminationForm: temp.headToToeExamination,
              systemicExaminationForm: Object.assign({
                gastroIntestinalSystemForm: temp.gastrointestinalExamination,
                cardioVascularSystemForm: temp.cardiovascularExamination,
                respiratorySystemForm: temp.respiratoryExamination,
                centralNervousSystemForm: temp.centralNervousExamination,
                musculoSkeletalSystemForm: temp.musculoskeletalExamination,
                genitoUrinarySystemForm: temp.genitourinaryExamination,
              }),
            });
            this.patientExaminationForm.patchValue(ancFormData);
          }

          if (this.visitCategory == 'General OPD') {
            const ancFormData = Object.assign({
              generalExaminationForm: temp.generalExamination,
              headToToeExaminationForm: temp.headToToeExamination,
              systemicExaminationForm: Object.assign({
                gastroIntestinalSystemForm: temp.gastrointestinalExamination,
                cardioVascularSystemForm: temp.cardiovascularExamination,
                respiratorySystemForm: temp.respiratoryExamination,
                centralNervousSystemForm: temp.centralNervousExamination,
                musculoSkeletalSystemForm: temp.musculoskeletalExamination,
                genitoUrinarySystemForm: temp.genitourinaryExamination,
                obstetricExaminationForANCForm: temp.obstetricExamination,
              }),
            });
            this.patientExaminationForm.patchValue(ancFormData);
          }
        }
      });
  }

  //BU40088124 12/10/2021 Integrating Multilingual Functionality --Start--
  ngDoCheck() {
    this.fetchLanguageResponse();
  }

  fetchLanguageResponse() {
    this.languageComponent = new SetLanguageComponent(this.httpServiceService);
    this.languageComponent.setLanguage();
    this.currentLanguageSet = this.languageComponent.currentLanguageObject;
  }
  //--End--
}

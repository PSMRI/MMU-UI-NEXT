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

import { Component, OnInit, Input, DoCheck, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  NgForm,
} from '@angular/forms';

import {
  MasterdataService,
  NurseService,
  DoctorService,
} from '../../../../shared/services';

import { GeneralUtils } from '../../../../shared/utility';

import { ConfirmationService } from '../../../../../core/services/confirmation.service';
import { SetLanguageComponent } from 'src/app/app-modules/core/components/set-language.component';
import { HttpServiceService } from 'src/app/app-modules/core/services/http-service.service';
@Component({
  selector: 'app-covid-diagnosis',
  templateUrl: './covid-diagnosis.component.html',
  styleUrls: ['./covid-diagnosis.component.css'],
})
export class CovidDiagnosisComponent implements OnInit, DoCheck, OnChanges {
  utils = new GeneralUtils(this.fb);

  @Input()
  generalDiagnosisForm!: FormGroup;

  @Input()
  caseRecordMode!: string;

  designation: any;
  specialist!: boolean;
  doctorDiagnosis: any;
  current_language_set: any;

  constructor(
    private fb: FormBuilder,

    private nurseService: NurseService,
    private doctorService: DoctorService,
    private masterdataService: MasterdataService,
    private confirmationService: ConfirmationService,
    private httpServiceService: HttpServiceService
  ) {}

  ngOnInit() {
    this.designation = localStorage.getItem('designation');
    // if(this.generalDiagnosisForm.controls['specialistDiagnosis'] !=undefined)
    // this.generalDiagnosisForm.controls['specialistDiagnosis'].disable();
    //    this.specialist = false;
    // if (this.designation == "TC Specialist") {
    //   this.generalDiagnosisForm.controls['specialistDiagnosis'].enable();
    //   this.specialist = true;
    // } else {
    //   this.generalDiagnosisForm.controls['specialistDiagnosis'].disable();
    //   this.specialist = false;
    // }
    if (this.designation == 'TC Specialist') {
      this.generalDiagnosisForm.controls['doctorDiagnosis'].disable();
      this.specialist = true;
    } else {
      this.generalDiagnosisForm.controls['doctorDiagnosis'].enable();
      this.specialist = false;
    }
  }
  get specialistDaignosis() {
    return this.generalDiagnosisForm.get('specialistDiagnosis');
  }

  get doctorDaignosis() {
    return this.generalDiagnosisForm.get('doctorDiagnosis');
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
  }
  ngOnChanges() {
    if (this.caseRecordMode == 'view') {
      const beneficiaryRegID = localStorage.getItem('beneficiaryRegID');
      const visitID = localStorage.getItem('visitID');
      const visitCategory = localStorage.getItem('visitCategory');
      this.getDiagnosisDetails(beneficiaryRegID, visitID, visitCategory);
    }
  }

  diagnosisSubscription: any;
  getDiagnosisDetails(beneficiaryRegID: any, visitID: any, visitCategory: any) {
    this.diagnosisSubscription = this.doctorService
      .getCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory)
      .subscribe((res: any) => {
        if (res && res.statusCode == 200 && res.data && res.data.diagnosis) {
          console.log('caserecord', res.data.diagnosis);

          this.patchDiagnosisDetails(res.data.diagnosis);
        }
      });
  }
  patchDiagnosisDetails(diagnosis: any) {
    //

    // diagnosis.doctorDiagnosis = this.doctorDiagnosis;
    // referFormData.revisitDate = referForm.controls["doctorDiagnosis"].value;
    console.log('diagnosis', diagnosis.doctorDiagnonsis);

    this.generalDiagnosisForm.patchValue({
      doctorDiagnosis: diagnosis.doctorDiagnonsis,
    });
    // this.generalDiagnosisForm.patchValue({'prescriptionID' : diagnosis.prescriptionID });
    this.generalDiagnosisForm.patchValue(diagnosis);
  }
}

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

import { Component, OnInit, Input, DoCheck, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
  MasterdataService,
  DoctorService,
  NurseService,
} from '../../shared/services';
import { DatePipe } from '@angular/common';
import { IdrsscoreService } from '../../shared/services/idrsscore.service';
import { ConfirmationService } from 'src/app/app-modules/core/services';
import { HttpServiceService } from 'src/app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'src/app/app-modules/core/components/set-language.component';
import { MatDialog } from '@angular/material/dialog';
import { PreviousDetailsComponent } from 'src/app/app-modules/core/components/previous-details/previous-details.component';

@Component({
  selector: 'app-general-refer',
  templateUrl: './general-refer.component.html',
  styleUrls: ['./general-refer.component.css'],
  providers: [DatePipe],
})
export class GeneralReferComponent implements OnInit, DoCheck, OnDestroy {
  @Input()
  referForm!: FormGroup;

  @Input()
  referMode!: string;

  revisitDate: any;
  tomorrow: any;
  maxSchedulerDate: any;
  today: any;
  higherHealthcareCenter: any;
  additionalServices: any;
  beneficiaryRegID: any;
  visitID: any;
  visitCategory: any;

  previousServiceList: any;
  referralReason: any;
  selectValue: any;
  selectValueService: any;
  healthCareReferred: boolean = false;
  showMsg: any = 0;
  tmcSuggested: any = 0;
  instituteFlag: boolean = false;
  hypertensionSelected: any = 0;
  confirmedDiabeticValue: any;
  currentLanguageSet: any;
  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    public datepipe: DatePipe,
    private masterdataService: MasterdataService,
    private idrsScoreService: IdrsscoreService,
    private nurseService: NurseService,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private httpServices: HttpServiceService
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    this.visitCategory = localStorage.getItem('visitCategory');
    this.getDoctorMasterData();
    this.idrsScoreService.IDRSSuspectedFlag$.subscribe(response => {
      this.showMsg = response;
      if (this.showMsg > 0) sessionStorage.setItem('suspectFlag', 'true');
      else sessionStorage.setItem('suspectFlag', 'false');
    });
    this.idrsScoreService.tmcSuggestedFlag$.subscribe(
      response => (this.tmcSuggested = response)
    );
    this.idrsScoreService.referralSuggestedFlag$.subscribe(response => {
      this.showMsg = response;
      if (this.showMsg > 0) sessionStorage.setItem('suspectFlag', 'true');
      else sessionStorage.setItem('suspectFlag', 'false');
    });
    this.today = new Date();
    const d = new Date();
    const checkdate = new Date();
    d.setDate(d.getDate() + 1);
    checkdate.setMonth(this.today.getMonth() + 3);
    this.maxSchedulerDate = checkdate;
    this.tomorrow = d;
  }
  /*
   * JA354063 - Multilingual Changes added on 13/10/21
   */
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  // Ends

  ngOnDestroy() {
    if (this.doctorMasterDataSubscription)
      this.doctorMasterDataSubscription.unsubscribe();
    if (this.referSubscription) this.referSubscription.unsubscribe();

    this.idrsScoreService.clearSuspectedArrayFlag();
    this.idrsScoreService.clearTMCSuggested();
    this.idrsScoreService.clearReferralSuggested();
  }

  doctorMasterDataSubscription: any;
  getDoctorMasterData() {
    this.doctorMasterDataSubscription =
      this.masterdataService.doctorMasterData$.subscribe(masterData => {
        if (masterData) {
          this.higherHealthcareCenter = masterData.higherHealthCare;
          if (this.higherHealthcareCenter.length === 0) {
            this.instituteFlag = false;
            sessionStorage.setItem('instFlag', 'false');
          } else {
            this.instituteFlag = true;
            sessionStorage.setItem('instFlag', 'true');
          }
          this.additionalServices = masterData.additionalServices;
          console.log(masterData.revisitDate);
          console.log('hi');
          this.revisitDate = masterData.revisitDate;

          if (String(this.referMode) === 'view') {
            this.beneficiaryRegID = localStorage.getItem('beneficiaryRegID');
            this.visitID = localStorage.getItem('visitID');
            this.visitCategory = localStorage.getItem('visitCategory');
            this.getReferDetails(
              this.beneficiaryRegID,
              this.visitID,
              this.visitCategory
            );
          }
        }
      });
  }

  referSubscription: any;
  getReferDetails(beneficiaryRegID: any, visitID: any, visitCategory: any) {
    this.referSubscription = this.doctorService
      .getCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory)
      .subscribe((res: any) => {
        if (res && res.statusCode === 200 && res.data && res.data.Refer) {
          this.patchReferDetails(res.data.Refer);
        }
      });
  }

  patchReferDetails(referDetails: any) {
    this.revisitDate = referDetails.revisitDate;
    this.referralReason = referDetails.referralReason;
    this.revisitDate = this.datepipe.transform(this.revisitDate, 'yyyy-MM-dd');
    const temp: any = [];
    if (referDetails.refrredToAdditionalServiceList) {
      this.previousServiceList = referDetails.refrredToAdditionalServiceList;
      referDetails.refrredToAdditionalServiceList.map((item: any) => {
        const arr = this.additionalServices.filter((element: any) => {
          return element.serviceName === item.serviceName;
        });
        if (arr.length > 0) temp.push(arr[0]);
      });
    }
    referDetails.refrredToAdditionalServiceList = temp.slice();

    const referedToInstitute = this.higherHealthcareCenter.filter(
      (item: any) => {
        return item.institutionID === referDetails.referredToInstituteID;
      }
    );
    if (referedToInstitute.length > 0) {
      referDetails.referredToInstituteName = referedToInstitute[0];
    }
    console.log('referredDet=' + referDetails);
    console.log('revisitDate' + this.revisitDate);
    referDetails.revisitDate = this.revisitDate;
    referDetails.referralReason = this.referralReason;
    this.referForm.patchValue({ referralReason: referDetails.referralReason });
    this.referForm.patchValue(referDetails);
    if (referDetails.referredToInstituteName !== null) {
      this.healthCareReferred = true;
    }
  }
  get RevisitDate() {
    return this.referForm.get('revisitDate');
  }

  get ReferralReason() {
    return this.referForm.get('referralReason');
  }

  checkdate(revisitDate: any) {
    this.today = new Date();
    const d = new Date();
    const checkdate = new Date();
    d.setDate(d.getDate() + 1);
    checkdate.setMonth(this.today.getMonth() + 3);
    this.maxSchedulerDate = checkdate;
    this.tomorrow = d;
  }

  canDisable(service: any) {
    if (this.previousServiceList) {
      const temp = this.previousServiceList.filter((item: any) => {
        return item === service.serviceName;
      });

      if (temp.length > 0) {
        service.disabled = true;
        return true;
      } else {
        service.disabled = false;
        return false;
      }
    } else {
      // If previousServiceList is falsy, return false or any other default value
      return false;
    }
  }

  public additionalservices(selected: any): void {
    if (selected !== null && selected.length > 0) {
      this.selectValueService = selected.length;
      console.log(this.selectValueService);
    }
  }

  public higherhealthcarecenter(selected: any): void {
    if (selected !== null && selected.institutionName) {
      this.selectValue = 1;
      this.healthCareReferred = true;
    } // should display the selected option.

    console.log(this.selectValue);
  }

  getPreviousReferralHistory() {
    const benRegID: any = localStorage.getItem('beneficiaryRegID');
    this.nurseService
      .getPreviousReferredHistory(benRegID, this.visitCategory)
      .subscribe(
        (res: any) => {
          if (res.statusCode === 200 && res.data !== null) {
            if (res.data.data.length > 0) {
              this.viewPreviousData(res.data);
            } else {
              this.confirmationService.alert(
                this.currentLanguageSet.Referdetails
                  .previousReferralhistorynotAvailable
              );
            }
          } else {
            this.confirmationService.alert(
              'Error in fetching previous history',
              'error'
            );
          }
        },
        err => {
          this.confirmationService.alert(
            'Error in fetching previous history',
            'error'
          );
        }
      );
  }

  viewPreviousData(data: any) {
    this.dialog.open(PreviousDetailsComponent, {
      data: {
        dataList: data,
        title: this.currentLanguageSet.previousReferralHistoryDetails,
      },
    });
  }
}

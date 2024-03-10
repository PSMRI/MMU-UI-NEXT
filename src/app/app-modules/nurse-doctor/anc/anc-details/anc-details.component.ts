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
import { FormGroup } from '@angular/forms';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { SetLanguageComponent } from '../../../core/components/set-language.component';
import { HttpServiceService } from '../../../core/services/http-service.service';

@Component({
  selector: 'app-nurse-anc-details',
  templateUrl: './anc-details.component.html',
  styleUrls: ['./anc-details.component.css'],
})
export class AncDetailsComponent implements OnInit, DoCheck, OnDestroy {
  @Input()
  patientANCDetailsForm!: FormGroup;

  today!: Date;
  dob!: Date;
  beneficiaryAge: any;
  current_language_set: any;

  constructor(
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private confirmationService: ConfirmationService,
    private httpServiceService: HttpServiceService
  ) {}

  ngOnInit() {
    this.getBenificiaryDetails();
    this.today = new Date();
    this.dob = new Date();
    this.dob.setMonth(this.today.getMonth() - 10);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
  }

  ngOnDestroy() {
    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();
  }

  beneficiaryDetailsSubscription: any;
  getBenificiaryDetails() {
    this.beneficiaryDetailsSubscription =
      this.beneficiaryDetailsService.beneficiaryDetails$.subscribe(
        beneficiaryDetails => {
          if (beneficiaryDetails) {
            this.beneficiaryAge = beneficiaryDetails.ageVal;
          }
        }
      );
  }

  checkupLMP(lmpDate: any) {
    const today = new Date();
    const checkdate = new Date();

    checkdate.setMonth(today.getMonth() - 9);

    if (lmpDate > checkdate && lmpDate < today) {
      this.patientANCDetailsForm.patchValue({ duration: null });
      this.calculateEDD(lmpDate);
      this.calculateGestationalAge(lmpDate);
      this.calculatePeriodOfPregnancy(lmpDate);
    } else {
      lmpDate = null;
      this.patientANCDetailsForm.patchValue({ lmpDate: lmpDate });
      this.confirmationService.alert(
        this.current_language_set.alerts.info.invalidVal
      );
      this.calculateEDD(lmpDate);
      this.calculateGestationalAge(lmpDate);
      this.calculatePeriodOfPregnancy(lmpDate);
    }
  }

  calculatePeriodOfPregnancy(lmpDate: any) {
    this.patientANCDetailsForm.patchValue({ duration: null });
  }

  calculateGestationalAge(lastMP: any) {
    let gestationalAge: any;
    if (lastMP != null) {
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      gestationalAge = Math.round(
        Math.abs(
          Math.round(
            Math.abs((this.today.getTime() - lastMP.getTime()) / oneDay)
          )
        ) / 7
      );
      this.patientANCDetailsForm.patchValue({
        gestationalAgeOrPeriodofAmenorrhea_POA: gestationalAge,
      });
      this.calculateTrimester(gestationalAge);
    } else {
      gestationalAge = null;
      this.patientANCDetailsForm.patchValue({
        gestationalAgeOrPeriodofAmenorrhea_POA: gestationalAge,
      });
      this.calculateTrimester(gestationalAge);
    }
  }

  calculateEDD(lastMP: any) {
    if (lastMP != null) {
      const edd = new Date(lastMP);
      edd.setDate(lastMP.getDate() + 280);
      this.patientANCDetailsForm.patchValue({ expDelDt: edd });
    } else {
      this.patientANCDetailsForm.patchValue({ expDelDt: null });
    }
  }

  calculateTrimester(trimesterWeeks: any) {
    if (trimesterWeeks != null) {
      if (trimesterWeeks >= 0 && trimesterWeeks <= 12) {
        this.patientANCDetailsForm.patchValue({ trimesterNumber: 1 });
      }
      if (trimesterWeeks >= 12 && trimesterWeeks <= 27) {
        this.patientANCDetailsForm.patchValue({ trimesterNumber: 2 });
      }
      if (trimesterWeeks >= 27) {
        this.patientANCDetailsForm.patchValue({ trimesterNumber: 3 });
      }
    } else {
      this.patientANCDetailsForm.patchValue({ trimesterNumber: null });
    }
  }

  checkPeriodOfPregnancy(periodOfPregnancy: any) {
    if (periodOfPregnancy > 9) {
      this.patientANCDetailsForm.patchValue({ duration: null });
      this.confirmationService.alert(
        this.current_language_set.alerts.info.invalidValue
      );
    } else if (periodOfPregnancy < 1) {
      this.patientANCDetailsForm.patchValue({ duration: null });
      this.confirmationService.alert(
        this.current_language_set.common.invalidValueMorethan
      );
    }
  }

  get primiGravida() {
    return this.patientANCDetailsForm.controls['primiGravida'].value;
  }

  get lmpDate() {
    return this.patientANCDetailsForm.controls['lmpDate'].value;
  }

  get gestationalAgeOrPeriodofAmenorrhea_POA() {
    return this.patientANCDetailsForm.controls[
      'gestationalAgeOrPeriodofAmenorrhea_POA'
    ].value;
  }

  get duration() {
    return this.patientANCDetailsForm.controls['duration'].value;
  }
}

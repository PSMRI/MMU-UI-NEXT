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
  EventEmitter,
  Output,
  ViewChild,
  OnDestroy,
  DoCheck,
  OnChanges,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, Subscription, mergeMap, of } from 'rxjs';
import {
  NurseService,
  MasterdataService,
  DoctorService,
} from '../shared/services';
import { NCDScreeningUtils } from '../shared/utility';
import { IdrsscoreService } from '../shared/services/idrsscore.service';
import { ActivatedRoute } from '@angular/router';
import {
  BeneficiaryDetailsService,
  ConfirmationService,
} from '../../core/services';
import { MatDialog } from '@angular/material/dialog';
import { HttpServiceService } from '../../core/services/http-service.service';
import { SetLanguageComponent } from '../../core/components/set-language.component';
import { PreviousDetailsComponent } from '../../core/components/previous-details/previous-details.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-idrs',
  templateUrl: './idrs.component.html',
  styleUrls: ['./idrs.component.css'],
})
export class IdrsComponent implements OnInit, OnDestroy, DoCheck, OnChanges {
  @Input()
  idrsScreeningForm!: FormGroup;

  @Input()
  patientMedicalForm!: FormGroup;

  @Input()
  ncdScreeningMode!: string;

  @Input()
  visitCategory: any;

  utils = new NCDScreeningUtils(this.fb);
  diseases: any = [];
  questions: any = [];
  beneficiaryDetailSubscription: any;
  age!: number;
  idrsScore: number = 0;
  form: any;
  questGroup!: FormGroup;
  arr: any = [];
  suspect: any = [];
  confirmDiseaseArray: any = [];
  questions1: any = [];
  idrsScoreWaist: number = 0;
  idrsScoreFamily: number = 0;
  IRDSscorePhysicalActivity: number = 0;
  doctorScreen: boolean = false;
  @Output() IDRSChanged: EventEmitter<any> = new EventEmitter<any>();
  scoreFlag: any = 0;
  required: any = [];
  isDiabetic: boolean = false;
  isVision: boolean = false;
  isEpilepsy: boolean = false;
  chronicDisabled: boolean = false;
  chronicData: any;
  revisit: boolean = false;
  nurse!: string;
  rev: any = [];
  confirmed: any = [];
  unchecked: any;
  systolicValueFromVital: number = 0;
  diastolicValueFromVital: number = 0;
  hypertensionChecked!: boolean;
  diastolicChange: boolean = false;
  systolicChange: boolean = false;
  currentLanguageSet: any;
  hypertensionSelectedFlagSubscription!: Subscription;
  systolicBpValueSubscription!: Subscription;
  diastolicBpValueSubscription!: Subscription;
  IdrsFamilyScoreSubscription!: Subscription;
  idrsPhysicalScoreSubscription!: Subscription;
  uncheckedDiseaseSubscription!: Subscription;
  visitDiseaseSubscription!: Subscription;
  IdrsScoreFlagSubscription!: Subscription;
  idrsWaistSubscription!: Subscription;

  // displayedColumns: any = ['sno', 'question', 'answer'];

  // dataSource = new MatTableDataSource<any>();

  constructor(
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private idrsScoreService: IdrsscoreService,
    private masterdataService: MasterdataService,
    private fb: FormBuilder,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService
  ) {}
  ngOnInit() {
    this.assignSelectedLanguage();
    console.log('currentMode', this.ncdScreeningMode);
    this.getNurseMasterData();
    this.getBeneficiaryDetails();
    this.suspect = [];
    this.confirmDiseaseArray = [];
    this.idrsScoreService.clearScoreFlag();
    this.idrsScoreService.clearDiabetesSelected();
    this.idrsScoreService.clearDiseaseSelected();
    this.idrsScoreService.clearUnchecked();
    this.idrsWaistScore();
    this.idrsFamilyHistoryScore();
    this.idrsPhysicalScoreActivity();
    this.uncheckedDiseases();
    this.visitDiseases();
    this.idrsFlagScore();
    //this.hypDiaAndSysBPObs();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  /* Vitals and history */
  idrsWaistScore() {
    this.idrsWaistSubscription =
      this.idrsScoreService.IDRSWaistScore$.subscribe(response => {
        response === undefined
          ? (this.idrsScoreWaist = 0)
          : (this.idrsScoreWaist = response);
        this.patchIdrsScoreValue();
      });
  }

  idrsFamilyHistoryScore() {
    this.IdrsFamilyScoreSubscription =
      this.idrsScoreService.IDRSFamilyScore$.subscribe(response => {
        response === undefined
          ? (this.idrsScoreFamily = 0)
          : (this.idrsScoreFamily = response);
        this.patchIdrsScoreValue();
      });
  }

  idrsPhysicalScoreActivity() {
    this.idrsPhysicalScoreSubscription =
      this.idrsScoreService.IDRSPhysicalActivityScore$.subscribe(response => {
        response === undefined
          ? (this.IRDSscorePhysicalActivity = 0)
          : (this.IRDSscorePhysicalActivity = response);
        this.patchIdrsScoreValue();
      });
  }

  patchIdrsScoreValue() {
    this.idrsScreeningForm.patchValue({
      idrsScore:
        this.idrsScore +
        this.idrsScoreWaist +
        this.idrsScoreFamily +
        this.IRDSscorePhysicalActivity,
    });
  }
  /* Ends Vitals and History */

  /*Observable for adding suspected diseases  */
  uncheckedDiseases() {
    this.uncheckedDiseaseSubscription =
      this.idrsScoreService.uncheckedDiseases$.subscribe(response => {
        this.unchecked = response;
        if (this.unchecked !== undefined && this.unchecked !== null) {
          let flag = false;
          for (const value of this.questions1) {
            if (
              value.diseaseQuestionType === this.unchecked &&
              value.answer === 'yes'
            )
              flag = true;
          }
          this.diseaseConfirmationBasedOnFlagValue(flag);
          this.pushUnCheckedDiseasesInArray();
        }
      });
  }
  diseaseConfirmationBasedOnFlagValue(flag: any) {
    if (!flag) {
      this.removeConfirmDiseaseArray(this.unchecked);
      for (const value of this.diseases) {
        if (value.disease.indexOf(this.unchecked) > -1) value.confirmed = false;
      }
    } else {
      this.removeConfirmDiseaseArray(this.unchecked);
      this.suspect.push(this.unchecked);

      if (this.suspect.includes('Diabetes'))
        this.idrsScoreService.setDiabetesSelected();

      for (const value of this.diseases) {
        if (value.disease.indexOf(this.unchecked) > -1) {
          value.confirmed = false;
          value.false = false;
        }
      }
    }
  }
  pushUnCheckedDiseasesInArray() {
    this.required = [];
    for (const value of this.diseases) {
      if (
        value !== undefined &&
        value.flag !== undefined &&
        value.flag !== null &&
        value.confirmed === false &&
        value.flag === true
      )
        this.required.push(value.disease);
    }
    this.idrsScreeningForm.patchValue({ requiredList: this.required });
  }
  /*Ends Observable for adding suspected diseases  */

  /* Observable for adding Confirm Diseases */
  visitDiseases() {
    this.visitDiseaseSubscription =
      this.idrsScoreService.visitDiseases$.subscribe(response => {
        this.confirmed = response;
        console.log('idrs confirmed', this.confirmed, this.confirmDiseaseArray);
        if (
          this.confirmed !== undefined &&
          this.confirmed !== null &&
          this.confirmed.length > 0
        ) {
          if (
            this.confirmed.includes('deleteHypertension') ||
            this.confirmed.includes('deleteDiabetes')
          ) {
            this.deleteDiagnosisConfirmedDisease();
          } else {
            // this.idrsScoreService.enableDiseaseConfirmation(true);
            for (const value of this.diseases) {
              value.confirmed = false;
            }
            for (const confirmDisease of this.confirmed) {
              for (const disease of this.diseases) {
                if (disease.disease.indexOf(confirmDisease) > -1)
                  disease.confirmed = true;
              }
            }
            this.required = [];
            for (const value of this.diseases) {
              if (
                value !== undefined &&
                value.flag !== undefined &&
                value.flag !== null &&
                value.confirmed === false &&
                value.flag === true
              )
                this.required.push(value.disease);
            }
            console.log('confirmed', this.diseases);
            const flag = false;
            this.updateDiabetesQuestionValue();

            for (const confirmDisease of this.confirmed) {
              this.addToconfirmDiseaseArray(confirmDisease);
            }
            console.log('diseaseListSuspect', this.diseases);
            this.suspect.forEach((element: any) => {
              this.confirmDiseaseArray.forEach((element1: any) => {
                if (element1 === element) {
                  this.removeSuspect(element);
                }

                if (element1 === 'Diabetes') {
                  this.idrsScoreService.clearDiabetesSelected();
                }
              });
            });
          }
        }
      });
  }
  /*  Ends Observable for adding Confirm Diseases */

  /*  Ends Observable for adding Confirm Diseases */
  updateDiabetesQuestionValue() {
    this.required.forEach((val: any, index: any) => {
      if (val === 'Diabetes') {
        if (
          this.idrsScore +
            this.idrsScoreWaist +
            this.idrsScoreFamily +
            this.IRDSscorePhysicalActivity <
          60
        )
          this.required.splice(index, 1);
      }
    });
    this.idrsScreeningForm.patchValue({ requiredList: this.required });
  }

  /* This observable for Vitals and history */

  idrsFlagScore() {
    this.IdrsScoreFlagSubscription =
      this.idrsScoreService.IDRSScoreFlagCheck$.subscribe(response => {
        this.scoreFlag = response;
        if (response === 1) {
          this.patchIdrsScoreValue();
          this.IDRSChanged.emit(false);
          let check = false;
          if (this.revisit) {
            if (this.isDiabetic === false) check = true;
          } else if (this.isDiabetic) {
            check = false;
          } else check = true;
          if (
            this.idrsScoreWaist +
              this.idrsScore +
              this.idrsScoreFamily +
              this.IRDSscorePhysicalActivity >=
              60 &&
            check === true
          ) {
            this.required = [];
            for (const disease of this.diseases) {
              if (disease.disease.indexOf('Diabetes') > -1) {
                let Rflag = false;
                for (const question of this.questions1) {
                  if (
                    question.diseaseQuestionType === 'Diabetes' &&
                    question.answer === null
                  ) {
                    Rflag = true;
                    break;
                  }
                }
                if (!Rflag) disease.flag = false;
                else disease.flag = true;
              }
              if (
                disease !== undefined &&
                disease.flag !== undefined &&
                disease.flag !== null &&
                disease.confirmed === false &&
                disease.flag === true
              )
                this.required.push(disease.disease);
            }
            this.updateDiabetesQuestionValue();
            console.log(
              'requi',
              this.idrsScreeningForm.controls['requiredList'].value
            );
          } else {
            this.required = [];
            for (const disease of this.diseases) {
              if (disease.disease.indexOf('Diabetes') > -1)
                disease.flag = false;
              if (
                disease !== undefined &&
                disease.flag !== undefined &&
                disease.flag !== null &&
                disease.confirmed === false &&
                disease.flag === true
              )
                this.required.push(disease.disease);
            }
            this.updateDiabetesQuestionValue();
          }
        } else {
          this.IDRSChanged.emit(true);
        }
      });
    this.hypDiaAndSysBPObs();
  }

  checkQuestionsToAddInSuspect(disease: any) {
    for (const question of this.questions1) {
      if (
        question.diseaseQuestionType === disease &&
        question.answer === 'yes'
      ) {
        this.addToSuspected('Diabetes');
        for (const value of this.diseases) {
          if (value.disease.indexOf('Diabetes') > -1) value.confirmed = false;
        }
        break;
      }
    }
  }

  hypDiaAndSysBPObs() {
    this.hypertensionSelectedFlagSubscription =
      this.idrsScoreService.hypertensionSelectedFlag$.subscribe(respone => {
        if (respone === 1) {
          this.hypertensionChecked = true;
        } else {
          this.hypertensionChecked = false;
        }
        // else {
        //   this.addHypertensionToSuspectedArray();
        // }
        this.addHypertensionToSuspectedArray();
      });
  }
  addHypertensionToSuspectedArray() {
    // adding hypertension to the suspected array according to the value of systolic BP
    this.systolicBpValueSubscription =
      this.idrsScoreService.systolicBpValue$.subscribe(response => {
        if (response !== undefined) {
          if (!this.hypertensionChecked) this.systolicBPObs(response);
        }
      });

    // adding hypertension to suspected array according to the value of diastolic BP
    this.diastolicBpValueSubscription =
      this.idrsScoreService.diastolicBpValue$.subscribe(response => {
        if (response !== undefined) {
          if (!this.hypertensionChecked) this.diastolicBPObs(response);
        }
      });
  }

  systolicBPObs(response: any) {
    this.systolicValueFromVital = response;
    let hypertensionFound = false;
    if (response !== null && response >= 140) {
      this.suspect.forEach((element: any) => {
        if (element === 'Hypertension') {
          hypertensionFound = true;
        }
      });
      if (!hypertensionFound) {
        this.addToSuspectedHyper('Hypertension');
      }
    } else if (this.diastolicValueFromVital < 90) {
      if (this.suspect.length > 0) this.removeSuspectedHyper('Hypertension');
    }
  }
  diastolicBPObs(response: any) {
    this.diastolicValueFromVital = response;
    let hypertensionFound = false;
    if (response !== null && response >= 90) {
      this.suspect.forEach((element: any) => {
        if (element === 'Hypertension') {
          hypertensionFound = true;
        }
      });
      if (!hypertensionFound) {
        this.addToSuspectedHyper('Hypertension');
      }
    } else {
      if (this.systolicValueFromVital < 140) {
        if (this.suspect.length > 0) this.removeSuspectedHyper('Hypertension');
      }
    }
  }
  ngOnDestroy() {
    this.suspect = [];
    this.confirmDiseaseArray = [];

    this.idrsScoreService.clearScoreFlag();
    this.idrsScoreService.clearDiabetesSelected();
    this.idrsScoreService.clearDiseaseSelected();
    this.idrsScoreService.clearDiastolicBp();
    this.idrsScoreService.clearSystolicBp();
    this.idrsScoreService.clearHypertensionSelected();
    if (this.idrsWaistSubscription) this.idrsWaistSubscription.unsubscribe();
    if (this.IdrsFamilyScoreSubscription)
      this.IdrsFamilyScoreSubscription.unsubscribe();
    if (this.idrsPhysicalScoreSubscription)
      this.idrsPhysicalScoreSubscription.unsubscribe();
    if (this.uncheckedDiseaseSubscription)
      this.uncheckedDiseaseSubscription.unsubscribe();
    if (this.visitDiseaseSubscription)
      this.visitDiseaseSubscription.unsubscribe();
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();
    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();
    if (this.IdrsScoreFlagSubscription)
      this.IdrsScoreFlagSubscription.unsubscribe();
    if (this.hypertensionSelectedFlagSubscription)
      this.hypertensionSelectedFlagSubscription.unsubscribe();
    if (this.systolicBpValueSubscription)
      this.systolicBpValueSubscription.unsubscribe();
    if (this.diastolicBpValueSubscription)
      this.diastolicBpValueSubscription.unsubscribe();
  }
  deleteDiagnosisConfirmedDisease() {
    if (
      this.confirmed.includes('Hypertension') &&
      this.confirmed.includes('Diabetes') &&
      this.confirmDiseaseArray.includes('Hypertension') &&
      this.confirmDiseaseArray.includes('Diabetes')
    ) {
      this.removeDiagnosisConfirmedDisease(
        'Hypertension',
        'deleteHypertension'
      );
      this.removeDiagnosisConfirmedDisease('Diabetes', 'deleteDiabetes');
    } else if (
      this.confirmed.includes('Hypertension') &&
      this.confirmed.includes('deleteHypertension') &&
      this.confirmDiseaseArray.includes('Hypertension')
    ) {
      this.removeDiagnosisConfirmedDisease(
        'Hypertension',
        'deleteHypertension'
      );
    } else {
      if (
        this.confirmed.includes('Diabetes') &&
        this.confirmed.includes('deleteDiabetes') &&
        this.confirmDiseaseArray.includes('Diabetes')
      ) {
        this.removeDiagnosisConfirmedDisease('Diabetes', 'deleteDiabetes');
      } else {
        console.log('removed diseases');
      }
    }
  }
  removeDiagnosisConfirmedDisease(disease: any, tokenTodeleteDisease: any) {
    const index = this.confirmed.indexOf('disease');
    const deleteIndex = this.confirmed.indexOf('tokenTodeleteDisease');
    const indexOfSuspectt = this.confirmDiseaseArray.indexOf('disease');
    this.confirmed.splice(index, 1);
    this.confirmed.splice(deleteIndex, 1);
    this.confirmDiseaseArray.splice(indexOfSuspectt, 1);
  }
  getPreviousVisit() {
    const obj = {
      benRegID: localStorage.getItem('beneficiaryRegID'),
    };
    this.nurseService.getPreviousVisitData(obj).subscribe(
      (res: any) => {
        if (res.statusCode === 200 && res.data !== null) {
          console.log('visit', res);
          this.isDiabetic = res.data.isDiabetic;
          this.isVision = res.data.isDefectiveVision;
          this.isEpilepsy = res.data.isEpilepsy;
          if (
            res.data.questionariesData !== null &&
            res.data.questionariesData.length > 0
          ) {
            if (this.age >= 30) {
              for (const disease of this.diseases) {
                if (
                  disease.disease.indexOf('Diabetes') > -1 &&
                  this.isDiabetic
                ) {
                  disease.flag = false;
                  disease.disabled = true;
                } else if (
                  disease.disease.indexOf('Diabetes') > -1 &&
                  this.idrsScore +
                    this.idrsScoreWaist +
                    this.idrsScoreFamily +
                    this.IRDSscorePhysicalActivity <
                    60
                ) {
                  disease.flag = false;
                } else if (
                  disease.disease.indexOf('Vision Screening') > -1 &&
                  this.isVision
                ) {
                  disease.flag = false;
                  if (this.isVision) disease.disabled = true;
                } else if (
                  disease.disease.indexOf('Epilepsy') > -1 &&
                  this.isEpilepsy
                ) {
                  disease.flag = false;
                  if (this.isEpilepsy) disease.disabled = true;
                }
                console.log('check req', this.diseases);
                if (
                  disease !== undefined &&
                  disease.flag !== undefined &&
                  disease.flag !== null &&
                  disease.confirmed === false &&
                  disease.flag === true
                )
                  this.required.push(disease.disease);
              }

              console.log('diseaseList', this.diseases);
              this.chronicDisabled = true;
              this.chronicDiseaseQuestions(res);
            }
            console.log('chronic', this.chronicDisabled);
            if (
              this.chronicData !== undefined &&
              this.chronicData.length > 0 &&
              this.chronicDisabled === true
            ) {
              if (
                this.confirmDiseaseArray !== undefined &&
                this.confirmDiseaseArray.length === 0 &&
                res.data.confirmedDisease !== undefined &&
                res.data.confirmedDisease !== null
              ) {
                this.confirmDiseaseArray = res.data.confirmedDisease.split(',');

                console.log('diseaseList', this.diseases);
              }
              if (this.isDiabetic) this.addToconfirmDiseaseArray('Diabetes');
              if (this.isEpilepsy) this.addToconfirmDiseaseArray('Epilepsy');
              if (this.isVision)
                this.addToconfirmDiseaseArray('Vision Screening');

              console.log('diseaseList', this.diseases);
              console.log('chronic1', this.questions1);
              this.required = [];
              for (const diseaseObj of this.diseases) {
                if (diseaseObj.flag === null && !this.chronicDisabled)
                  diseaseObj.flag = true;

                if (
                  diseaseObj !== undefined &&
                  diseaseObj.flag !== undefined &&
                  diseaseObj.flag !== null &&
                  diseaseObj.confirmed === false &&
                  diseaseObj.flag === true
                )
                  this.required.push(diseaseObj.disease);
              }
              this.updateDiabetesQuestionValue();
            }
          }
        }
      },
      err => {
        this.confirmationService.alert(err, 'error');
        this.IDRSChanged.emit(false);
      }
    );
    this.updateFormWithSuspectConfirmQuestionArray();
  }
  chronicDiseaseQuestions(res: any) {
    let confirmedDisease: any;
    if (res.data.confirmedDisease)
      confirmedDisease = res.data.confirmedDisease.split(',');
    this.diseases.forEach((value: any) => {
      if (value.disease.indexOf('Tuberculosis Screening') > -1) {
        if (confirmedDisease !== undefined && confirmedDisease !== null) {
          confirmedDisease.forEach((element: any) => {
            if (element === 'Tuberculosis Screening') {
              value.disabled = true;
              value.flag = false;
            }
          });
        }
      } else if (value.disease.indexOf('Malaria Screening') > -1) {
        if (confirmedDisease !== undefined && confirmedDisease !== null) {
          confirmedDisease.forEach((element: any) => {
            if (element === 'Malaria Screening') {
              value.disabled = true;
              value.flag = false;
            }
          });
        }
      } else if (value.disease.indexOf('Asthma') > -1) {
        if (confirmedDisease !== undefined && confirmedDisease !== null) {
          confirmedDisease.forEach((element: any) => {
            if (element === 'Asthma') {
              value.disabled = true;
              value.flag = false;
            }
          });
        }
      }
    });
    this.chronicData = res.data.questionariesData;
  }
  updateFormWithSuspectConfirmQuestionArray() {
    if (
      (this.route.snapshot.params['attendant'] === 'doctor' ||
        this.route.snapshot.params['attendant'] === 'tcspecialist') &&
      this.revisit
    ) {
      this.arr = [];
      for (const question of this.questions1) {
        if (question.answer !== null) this.arr.push(question);
      }
      this.idrsScreeningForm.patchValue({ questionArray: this.arr });
      this.idrsScreeningForm.patchValue({ suspectArray: this.suspect });
      this.idrsScreeningForm.patchValue({
        confirmArray: this.confirmDiseaseArray,
      });
      this.updateDiabetesQuestionValue();
      console.log('diseaseList', this.diseases);
    }
  }
  ngOnChanges() {
    if (this.ncdScreeningMode === 'view') {
      this.doctorScreen = true;
      const visitID = localStorage.getItem('visitID');
      const benRegID = localStorage.getItem('beneficiaryRegID');
      this.getBeneficiaryDetails();
      if (visitID !== null && benRegID !== null) {
        this.getIDRSDetailsFrmNurse(visitID, benRegID);
      }
    }

    const specialistFlagItem = localStorage.getItem('specialistFlag')!;

    if (parseInt(specialistFlagItem, 10) === 100) {
      this.doctorScreen = true;
      const visitID = localStorage.getItem('visitID');
      const benRegID = localStorage.getItem('beneficiaryRegID');
      this.getBeneficiaryDetails();
      if (visitID !== null && benRegID !== null) {
        this.getIDRSDetailsFrmNurse(visitID, benRegID);
      }
    }
    if (this.ncdScreeningMode === 'update') {
      const visitCategory = localStorage.getItem('visitCategory');
      this.doctorScreen = true;
      this.updateIDRSDetails(this.idrsScreeningForm, visitCategory);
    }
  }
  updateIDRSDetails(idrsScreeningForm: any, visitCategory: any) {
    this.IDRSChanged.emit('check');

    this.doctorService
      .updateIDRSDetails(idrsScreeningForm, visitCategory)
      .subscribe(
        (res: any) => {
          if (res.statusCode === 200 && res.data !== null) {
            this.confirmationService.alert(res.data.response, 'success');
            this.IDRSChanged.emit(true);

            this.idrsScreeningForm.markAsPristine();
          } else {
            this.confirmationService.alert(res.errorMessage, 'error');
            this.IDRSChanged.emit(false);
          }
        },
        err => {
          this.confirmationService.alert(err, 'error');
          this.IDRSChanged.emit(false);
        }
      );
  }
  IDRSDetailsSubscription: any;
  questionArray: any = [];

  getIDRSDetailsFrmNurse(visitID: any, benRegID: any) {
    this.IDRSDetailsSubscription = this.doctorService
      .getIDRSDetails(benRegID, visitID)
      .subscribe(value => {
        if (value !== null && value.statusCode === 200 && value.data !== null) {
          if (
            (value.data.IDRSDetail.suspectedDisease !== undefined &&
              value.data.IDRSDetail.suspectedDisease !== null) ||
            (value.data.IDRSDetail.idrsDetails !== undefined &&
              value.data.IDRSDetail.idrsDetails !== null)
          ) {
            if (
              value.data.IDRSDetail.suspectedDisease &&
              value.data.IDRSDetail.suspectedDisease !== undefined &&
              value.data.IDRSDetail.suspectedDisease !== null
            ) {
              const suspectArray =
                value.data.IDRSDetail.suspectedDisease.split(',');
              suspectArray.forEach((element: any) => {
                this.addToSuspected(element);
              });
              // clearing suspect array observable according to suspect array
              this.settingSuspectedObservable();
            }
          }
          const IdrsArray = value.data.IDRSDetail.idrsDetails;
          for (let j = 0; j < IdrsArray.length; j++) {
            this.questionArray[j] = IdrsArray[j];
          }

          if (
            this.questionArray !== undefined &&
            this.questionArray.length > 0
          ) {
            let cflag = true;
            for (const questionArray of this.questions1) {
              for (const selectedQuestion of this.questionArray) {
                if (
                  questionArray.idrsQuestionID ===
                  selectedQuestion.idrsQuestionId
                ) {
                  cflag = false;
                  break;
                }
              }
            }
            this.revisit = cflag;
            if (
              this.age < 30 ||
              (this.questions1 !== undefined && this.questions1.length === 0)
            )
              this.revisit = false;
            console.log('revisit', this.revisit);
            for (const question of this.questions1) {
              for (const selectedQuestion of this.questionArray) {
                if (
                  question.idrsQuestionID === selectedQuestion.idrsQuestionId &&
                  (selectedQuestion.answer !== null ||
                    selectedQuestion.answer !== '')
                ) {
                  question.answer = selectedQuestion.answer.toLowerCase();
                  for (const disease of this.diseases) {
                    if (disease.disease === question.diseaseQuestionType)
                      disease.flag = false;
                  }
                  question.id = selectedQuestion.ID;
                }
              }
            }
            console.log('q1', this.questions1);
            this.required = [];
            for (const disease of this.diseases) {
              if (
                disease !== undefined &&
                disease.flag !== undefined &&
                disease.flag !== null &&
                disease.confirmed === false &&
                disease.flag === true
              )
                this.required.push(disease.disease);
            }
          }
          this.arr = [];
          for (const question of this.questions1) {
            if (question.answer !== null) this.arr.push(question);
          }
          this.idrsScreeningForm.patchValue({ questionArray: this.arr });
          this.idrsScreeningForm.patchValue({ suspectArray: this.suspect });
          this.idrsScreeningForm.patchValue({
            confirmArray: this.confirmDiseaseArray,
          });
          this.updateDiabetesQuestionValue();
          this.idrsScreeningForm.patchValue({
            idrsScore:
              this.idrsScore +
              this.idrsScoreWaist +
              this.idrsScoreFamily +
              this.IRDSscorePhysicalActivity,
          });
          let flag = false;
          for (const suspectDisease of this.suspect) {
            if (suspectDisease.indexOf('Diabetes') > -1) flag = true;
          }
          this.idrsScreeningForm.patchValue({ isDiabetic: flag });
          console.log('questions1Array', this.idrsScreeningForm);
          this.rev = [];
          for (const question of this.questions1) {
            if (question.answer !== null) this.rev.push(question);
          }
          this.getPreviousVisit();

          // this.hypDiaAndSysBPObs();
        }
        this.hypDiaAndSysBPObs();
      });
  }

  settingSuspectedObservable() {
    let loopBreak = false;
    this.suspect.forEach((element: any) => {
      if (!loopBreak) {
        if (
          element === 'Vision Screening' ||
          element === 'Epilepsy' ||
          element === 'Asthma' ||
          element === 'Tuberculosis Screening' ||
          element === 'Malaria Screening'
        ) {
          this.idrsScoreService.setSuspectedArrayValue();
          loopBreak = true;
        }
      }
    });
  }
  nurseMasterDataSubscription: any;
  getNurseMasterData() {
    this.nurseMasterDataSubscription =
      this.masterdataService.nurseMasterData$.subscribe(data => {
        if (data) {
          this.nurseMasterDataSubscription.unsubscribe();
          this.questions = data.IDRSQuestions;
          if (this.questions !== undefined && this.questions.length > 0) {
            for (const question of this.questions) {
              this.questions1.push({
                id: null,
                idrsQuestionID: question.idrsQuestionID,
                question: question.question,
                diseaseQuestionType: question.DiseaseQuestionType,
                answer: null,
              });
            }
            for (let i = 0; i < this.questions.length; i++) {
              if (i !== 0) {
                console.log(
                  this.questions.DiseaseQuestionType !==
                    this.questions[i - 1].DiseaseQuestionType
                );
                if (
                  this.questions[i].DiseaseQuestionType !==
                  this.questions[i - 1].DiseaseQuestionType
                )
                  this.diseases.push({
                    disease: this.questions[i].DiseaseQuestionType,
                    flag: null,
                    confirmed: false,
                    disabled: false,
                  });
              } else {
                this.diseases.push({
                  disease: this.questions[i].DiseaseQuestionType,
                  flag: null,
                  confirmed: false,
                  disabled: false,
                });
              }
            }
            if (this.age >= 30) {
              this.required = [];
              for (const disease of this.diseases) {
                if (!this.chronicDisabled) disease.flag = true;
                if (
                  disease.disease.indexOf('Diabetes') > -1 &&
                  this.idrsScore +
                    this.idrsScoreWaist +
                    this.idrsScoreFamily +
                    this.IRDSscorePhysicalActivity <
                    60
                ) {
                  disease.flag = false;
                }
                if (
                  disease !== undefined &&
                  disease.flag !== undefined &&
                  disease.flag !== null &&
                  disease.confirmed === false &&
                  disease.flag === true
                )
                  this.required.push(disease.disease);
              }
            }

            this.required.forEach((val: any, index: any) => {
              if (val === 'Diabetes') {
                if (
                  this.idrsScore +
                    this.idrsScoreWaist +
                    this.idrsScoreFamily +
                    this.IRDSscorePhysicalActivity <
                  60
                )
                  this.required.splice(index, 1);
              }
            });
            console.log('req', this.required);
            // this.updateDiabetesQuestionValue();
            this.idrsScreeningForm.patchValue({ requiredList: this.required });
            console.log('attendant', this.route.snapshot.params['attendant']);
            if (
              this.route.snapshot.params['attendant'] !== 'doctor' &&
              this.route.snapshot.params['attendant'] !== 'tcspecialist'
            )
              this.getPreviousVisit();
          }
          if (this.ncdScreeningMode === 'view') {
            const visitID = localStorage.getItem('visitID');
            const benRegID = localStorage.getItem('beneficiaryRegID');
            if (visitID !== null && benRegID !== null) {
              this.getIDRSDetailsFrmNurse(visitID, benRegID);
            }
          }
          const specialistFlagItem = localStorage.getItem('specialistFlag')!;

          if (parseInt(specialistFlagItem, 10) === 100) {
            const visitID = localStorage.getItem('visitID');
            const benRegID = localStorage.getItem('beneficiaryRegID');
            if (visitID !== null && benRegID !== null) {
              this.getIDRSDetailsFrmNurse(visitID, benRegID);
            }
          }
        }
      });
    console.log('checking', this.questions1);
  }
  radioChange(q: any, value: any, d: any) {
    this.IDRSChanged.emit(false);
    for (const question of this.questions1) {
      if (question.idrsQuestionID === q.idrsQuestionID) question.answer = value;
    }

    if (value === 'yes') this.addToSuspected(q.diseaseQuestionType);
    else {
      if (this.suspect.length > 0) this.removeSuspected(q.diseaseQuestionType);
    }
    this.removeConfirmDiseaseArray(q.diseaseQuestionType);
    const NCDScreeningForm = <FormGroup>(
      this.patientMedicalForm.controls['idrsScreeningForm']
    );
    console.log('idrsForm', NCDScreeningForm);
    NCDScreeningForm.patchValue({
      idrsScore:
        this.idrsScore +
        this.idrsScoreWaist +
        this.idrsScoreFamily +
        this.IRDSscorePhysicalActivity,
    });

    this.arr = [];
    for (let a = 0; a < this.rev.length; a++) {
      if (this.rev[a].idrsQuestionID === q.idrsQuestionID)
        this.rev.splice(a, 1);
    }
    if (
      this.chronicDisabled === true &&
      ((this.route.snapshot.params['attendant'] !== 'doctor' &&
        this.route.snapshot.params['attendant'] !== 'tcspecialist') ||
        this.revisit)
    ) {
      for (const question of this.questions1) {
        if (
          question.answer !== null &&
          question.idrsQuestionID === q.idrsQuestionID
        )
          this.rev.push(question);
      }
    } else {
      for (const questionValue of this.questions1) {
        if (questionValue.answer !== null) this.arr.push(questionValue);
      }
    }
    this.required = [];
    console.log('disease', d);
    for (const disease of this.diseases) {
      if (disease.disease === d) {
        let Rflag = false;
        for (const question of this.questions1) {
          if (question.diseaseQuestionType === d && question.answer === null) {
            Rflag = true;
            break;
          }
        }
        if (!Rflag) disease.flag = false;
      }
      console.log('dis', disease);
      if (
        disease !== undefined &&
        disease.flag !== undefined &&
        disease.flag !== null &&
        disease.confirmed === false &&
        disease.flag === true
      ) {
        this.required.push(disease.disease);
      }
    }

    if (
      this.chronicDisabled === true &&
      ((this.route.snapshot.params['attendant'] !== 'doctor' &&
        this.route.snapshot.params['attendant'] !== 'tcspecialist') ||
        this.revisit)
    ) {
      NCDScreeningForm.patchValue({ questionArray: this.rev });
    } else NCDScreeningForm.patchValue({ questionArray: this.arr });
    NCDScreeningForm.patchValue({ suspectArray: this.suspect });
    NCDScreeningForm.patchValue({ confirmArray: this.confirmDiseaseArray });
    this.required.forEach((val: any, index: any) => {
      if (val === 'Diabetes') {
        if (
          this.idrsScore +
            this.idrsScoreWaist +
            this.idrsScoreFamily +
            this.IRDSscorePhysicalActivity <
          60
        )
          this.required.splice(index, 1);
      }
    });
    console.log('req', this.required);
    NCDScreeningForm.patchValue({ requiredList: this.required });
    let flag = false;
    for (const suspectDisease of this.suspect) {
      if (suspectDisease.indexOf('Diabetes') > -1) flag = true;
    }
    NCDScreeningForm.patchValue({ isDiabetic: flag });
  }
  addToSuspectedHyper(val: any) {
    let suspectflag = false;
    let confirmflag = false;
    for (let i = 0; i < this.suspect.length; i++) {
      if (this.suspect[i] === val) suspectflag = true;
    }
    for (const confirmDisease of this.confirmDiseaseArray) {
      if (confirmDisease === val) confirmflag = true;
    }
    if (!suspectflag && !confirmflag) {
      this.suspect.push(val);
      if (val === 'Hypertension') {
        if (
          !(this.suspect.length === 1 && this.suspect.includes('Hypertension'))
        ) {
          this.IDRSChanged.emit(false);
          this.systolicChange = true;
        } else if (this.systolicChange) this.IDRSChanged.emit(false);
      }
      // if (val === "Diabetes")
      //   this.idrsScoreService.setDiabetesSelected();

      // this.settingSuspectedObservable();
    }
  }
  addToSuspected(val: any) {
    let suspectflag = false;
    let confirmflag = false;
    for (const suspectDisease of this.suspect) {
      if (suspectDisease === val) suspectflag = true;
    }
    for (const confirmDisease of this.confirmDiseaseArray) {
      if (confirmDisease === val) confirmflag = true;
    }
    if (!suspectflag && !confirmflag) {
      this.suspect.push(val);
      if (val === 'Diabetes') {
        this.idrsScoreService.setDiabetesSelected();
      }
      this.settingSuspectedObservable();
    }
  }
  addToconfirmDiseaseArray(val: any) {
    // let NCDScreeningForm = <FormGroup>(
    //   this.patientMedicalForm.controls["idrsScreeningForm"]
    // );
    let flag = false;
    for (const confirmDisease of this.confirmDiseaseArray) {
      if (confirmDisease === val) flag = true;
    }
    if (!flag) {
      this.confirmDiseaseArray.push(val);
      this.idrsScreeningForm.patchValue({ suspectArray: this.suspect });
      this.idrsScreeningForm.patchValue({
        confirmArray: this.confirmDiseaseArray,
      });
      this.updateDiabetesQuestionValue();
    }
  }

  removeSuspectedHyper(val: any) {
    let flag = false;
    for (const question of this.questions1) {
      if (question.diseaseQuestionType === val && question.answer === 'yes')
        flag = true;
    }
    if (!flag) {
      for (let i = 0; i < this.suspect.length; i++) {
        if (this.suspect[i] === val) {
          if (val === 'Hypertension') {
            if (
              !(
                this.suspect.length === 1 &&
                this.suspect.includes('Hypertension')
              )
            ) {
              this.IDRSChanged.emit(false);
              this.systolicChange = true;
            } else if (this.systolicChange) this.IDRSChanged.emit(false);
          }
          this.suspect.splice(i, 1);
        }
      }
      if (!this.suspect.includes('Diabetes')) {
        this.idrsScoreService.clearDiabetesSelected();
      } else {
        if (this.suspect.includes('Diabetes'))
          this.idrsScoreService.setDiabetesSelected();
      }
      if (this.suspect.length === 0) {
        this.idrsScoreService.clearSuspectedArrayFlag();
        this.idrsScoreService.clearDiabetesSelected();
      } else {
        if (
          !(
            this.suspect.includes('Vision Screening') ||
            this.suspect.includes('Epilepsy') ||
            this.suspect.includes('Asthma') ||
            this.suspect.includes('Tuberculosis Screening') ||
            this.suspect.includes('Malaria Screening')
          )
        ) {
          this.idrsScoreService.clearSuspectedArrayFlag();
        } else {
          this.idrsScoreService.setSuspectedArrayValue();
        }
      }
    }
  }
  removeSuspected(val: any) {
    let flag = false;
    for (const question of this.questions1) {
      if (question.diseaseQuestionType === val && question.answer === 'yes')
        flag = true;
    }
    if (!flag) {
      for (let i = 0; i < this.suspect.length; i++) {
        if (this.suspect[i] === val) this.suspect.splice(i, 1);
      }
      if (!this.suspect.includes('Diabetes')) {
        this.idrsScoreService.clearDiabetesSelected();
      } else {
        if (this.suspect.includes('Diabetes'))
          this.idrsScoreService.setDiabetesSelected();
      }
      // else {
      //   if (this.suspect.includes("Diabetes") && this.updateRBSValue)
      //     this.idrsScoreService.setDiabetesSelected();
      // }
      if (this.suspect.length === 0) {
        this.idrsScoreService.clearSuspectedArrayFlag();
        this.idrsScoreService.clearDiabetesSelected();
      } else {
        if (
          !(
            this.suspect.includes('Vision Screening') ||
            this.suspect.includes('Epilepsy') ||
            this.suspect.includes('Asthma') ||
            this.suspect.includes('Tuberculosis Screening') ||
            this.suspect.includes('Malaria Screening')
          )
        ) {
          this.idrsScoreService.clearSuspectedArrayFlag();
        } else {
          this.idrsScoreService.setSuspectedArrayValue();
        }
      }
    }
  }

  removeSuspect(val: any) {
    let flag = false;
    for (const disease of this.questions1) {
      flag = true;
    }
    if (flag) {
      for (let i = 0; i < this.suspect.length; i++) {
        if (this.suspect[i] === val) this.suspect.splice(i, 1);
      }
      if (!this.suspect.includes('Diabetes')) {
        this.idrsScoreService.clearDiabetesSelected();
      }
      if (this.suspect.length === 0) {
        this.idrsScoreService.clearSuspectedArrayFlag();
        this.idrsScoreService.clearDiabetesSelected();
      } else {
        if (
          !(
            this.suspect.includes('Vision Screening') ||
            this.suspect.includes('Epilepsy') ||
            this.suspect.includes('Asthma') ||
            this.suspect.includes('Tuberculosis Screening') ||
            this.suspect.includes('Malaria Screening')
          )
        ) {
          this.idrsScoreService.clearSuspectedArrayFlag();
        } else {
          this.idrsScoreService.setSuspectedArrayValue();
        }
      }
    }
  }
  removeConfirmDiseaseArray(val: any) {
    const NCDScreeningForm = <FormGroup>(
      this.patientMedicalForm.controls['idrsScreeningForm']
    );
    const flag = false;

    if (!flag) {
      for (let i = 0; i < this.confirmDiseaseArray.length; i++) {
        if (this.confirmDiseaseArray[i] === val)
          this.confirmDiseaseArray.splice(i, 1);
      }

      NCDScreeningForm.patchValue({ suspectArray: this.suspect });
      NCDScreeningForm.patchValue({ confirmArray: this.confirmDiseaseArray });
      this.required.forEach((val: any, index: any) => {
        if (val === 'Diabetes') {
          if (
            this.idrsScore +
              this.idrsScoreWaist +
              this.idrsScoreFamily +
              this.IRDSscorePhysicalActivity <
            60
          )
            this.required.splice(index, 1);
        }
      });
      console.log('req', this.required);
      NCDScreeningForm.patchValue({ requiredList: this.required });
    }
  }
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription =
      this.beneficiaryDetailsService.beneficiaryDetails$
        .pipe(
          mergeMap((beneficiary: any) => {
            console.log('idrs', beneficiary);
            if (beneficiary) {
              if (beneficiary.ageVal) {
                this.age = beneficiary.ageVal;

                if (this.age < 35) this.idrsScore = 0;
                else if (this.age >= 35 && this.age < 50) this.idrsScore = 20;
                else this.idrsScore = 30;
              } else {
                this.age = 0;
              }
              console.log('required', this.required);
              return this.nurseService.getNcdScreeningVisitCount(
                beneficiary.beneficiaryRegID
              );
            } else {
              return of(null);
            }
          })
        )
        .subscribe((res: any) => {});
  }
  getPreviousDiabetesHistory() {
    const benRegID: any = localStorage.getItem('beneficiaryRegID');
    this.nurseService
      .getPreviousDiabetesHistory(benRegID, this.visitCategory)
      .subscribe(
        (res: any) => {
          if (res.statusCode === 200 && res.data !== null) {
            if (res.data.data.length > 0) {
              this.viewPreviousData(res.data);
            } else {
              this.confirmationService.alert(
                this.currentLanguageSet.pastDiabetesHistoryNotAvailable
              );
            }
          } else {
            this.confirmationService.alert(
              this.currentLanguageSet.alerts.info.errorFetchingHistory,
              'error'
            );
          }
        },
        err => {
          this.confirmationService.alert(
            this.currentLanguageSet.alerts.info.errorFetchingHistory,
            'error'
          );
        }
      );
  }

  viewPreviousData(data: any) {
    this.dialog.open(PreviousDetailsComponent, {
      data: {
        dataList: data,
        title: this.currentLanguageSet.previousDiabetesHistoryDetails,
      },
    });
  }
}

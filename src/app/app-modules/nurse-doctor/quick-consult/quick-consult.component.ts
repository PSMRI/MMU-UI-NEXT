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
  OnDestroy,
  Input,
  OnChanges,
  ViewEncapsulation,
  ViewChild,
  DoCheck,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  NgForm,
  AbstractControl,
} from '@angular/forms';
import {
  Params,
  RouterModule,
  Routes,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { ConfirmationService } from '../../core/services/confirmation.service';
import {
  DoctorService,
  MasterdataService,
  NurseService,
} from '../shared/services';
import { QuickConsultUtils } from '../shared/utility';
import { TestInVitalsService } from '../shared/services/test-in-vitals.service';
import { environment } from 'src/environments/environment';
import { PageEvent } from '@angular/material/paginator';
import { HttpServiceService } from '../../core/services/http-service.service';
import { MatDialog } from '@angular/material/dialog';
import { SetLanguageComponent } from '../../core/components/set-language.component';
import { IotcomponentComponent } from '../../core/components/iotcomponent/iotcomponent.component';
import { MatTableDataSource } from '@angular/material/table';

interface prescribe {
  id: string;
  drugID: string;
  drugName: string;
  drugStrength: string;
  drugUnit: string;
  quantity: string;
  formID: string;
  qtyPrescribed: string;
  route: string;
  formName: string;
  dose: string;
  frequency: string;
  duration: string;
  unit: string;
  instructions: string;
  sctCode: string;
  sctTerm: string;
  isEDL: any;
}
@Component({
  selector: 'app-doctor-quick-consult',
  templateUrl: './quick-consult.component.html',
  styleUrls: ['./quick-consult.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class QuickConsultComponent
  implements OnInit, OnDestroy, OnChanges, DoCheck
{
  utils = new QuickConsultUtils(this.fb);

  @ViewChild('prescriptionForm')
  prescriptionForm!: NgForm;

  @Input()
  patientQuickConsultForm!: FormGroup;

  @Input()
  quickConsultMode!: string;

  drugPrescriptionForm!: FormGroup;
  createdBy: any;
  startRBSTest = environment.startRBSurl;
  pageSize = 5;
  pageEvent!: PageEvent;
  pageLimits: any = [];
  rbsPopup: boolean = false;
  currentPrescription: prescribe = {
    id: '',
    drugID: '',
    drugName: '',
    drugStrength: '',
    drugUnit: '',
    qtyPrescribed: '',
    quantity: '',
    route: '',
    formID: '',
    formName: '',
    dose: '',
    frequency: '',
    duration: '',
    unit: '',
    instructions: '',
    sctCode: '',
    sctTerm: '',
    isEDL: '',
  };

  tempDrugName: any;
  tempform: any;

  masterData: any;

  chiefComplaintMaster: any;
  chiefComplaintTemporarayList: any = [];
  selectedChiefComplaintList: any = [];
  suggestedChiefComplaintList: any = [];

  benChiefComplaints = [];

  filteredDrugMaster: any = [];
  filteredDrugDoseMaster: any = [];
  subFilteredDrugMaster: any = [];
  drugMaster: any;
  drugFormMaster: any;
  drugDoseMaster: any;
  drugFrequencyMaster: any;
  drugDurationMaster: any = [];
  drugRouteMaster: any;
  drugDurationUnitMaster: any;

  nonRadiologyMaster: any;
  radiologyMaster: any;
  previousLabTestList: any;
  previousChiefComplaints: any;

  medicines: Array<any> = [];
  prescribedDrugsList: any;
  edlMaster: any;
  isStockAvalable!: string;
  currentLanguageSet: any;
  rbsSelectedInInvestigation!: boolean;
  rbsSelectedInInvestigationSubscription: any;
  rbsTestResultCurrent: any;
  rbsTestResultCurrentSubscription: any;

  displayedColumns: any = ['chiefcomplaint', 'ConceptID', 'description'];

  dataSource = new MatTableDataSource<any>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private masterdataService: MasterdataService,
    private confirmationService: ConfirmationService,
    private httpServices: HttpServiceService,
    private nurseService: NurseService,
    private dialog: MatDialog,
    private testInVitalsService: TestInVitalsService
  ) {}

  ngOnInit() {
    this.rbsPopup = false;
    this.nurseService.clearRbsSelectedInInvestigation();
    this.nurseService.clearRbsInVitals();
    this.assignSelectedLanguage();
    this.createdBy = localStorage.getItem('userName');
    this.getPrescriptionForm();
    this.setLimits();
    this.makeDurationMaster();
    this.loadMasterData();
    this.rbsSelectedInInvestigationSubscription =
      this.nurseService.rbsSelectedInInvestigation$.subscribe(response =>
        response === undefined
          ? (this.rbsSelectedInInvestigation = false)
          : (this.rbsSelectedInInvestigation = response)
      );
    this.rbsTestResultCurrentSubscription =
      this.nurseService.rbsTestResultCurrent$.subscribe(response =>
        response === undefined
          ? (this.rbsTestResultCurrent = null)
          : (this.rbsTestResultCurrent = response)
      );
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
  ngOnChanges() {
    this.nurseService.rbsTestResultFromDoctorFetch = null;
  }
  openIOTRBSModel() {
    this.rbsPopup = true;
    const dialogRef = this.dialog.open(IotcomponentComponent, {
      width: '600px',
      height: '180px',
      disableClose: true,
      data: { startAPI: this.startRBSTest },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.rbsPopup = false;
      if (result !== null) {
        this.patientQuickConsultForm.patchValue({
          rbsTestResult: result['result'],
        });
        this.patientQuickConsultForm.controls['rbsTestResult'].markAsDirty();
        if (
          this.patientQuickConsultForm.controls['rbsTestResult'].value &&
          this.patientQuickConsultForm.controls['rbsTestResult'].value !== null
        ) {
          this.nurseService.setRbsInCurrentVitals(
            this.patientQuickConsultForm.controls['rbsTestResult'].value
          );
        }

        this.setRBSResultInReport();
      }
    });
  }

  setRBSResultInReport() {
    if (this.patientQuickConsultForm.value) {
      const todayDate = new Date();

      const patientQCVitalsDataForReport = Object.assign(
        {},
        this.patientQuickConsultForm.getRawValue(),
        {
          createdDate: todayDate,
        }
      );

      this.testInVitalsService.setVitalsRBSValueInReportsInUpdate(
        patientQCVitalsDataForReport
      );
    }
  }

  ngOnDestroy() {
    if (this.masterDataSubscription) {
      this.masterDataSubscription.unsubscribe();
    }
    if (this.getQuickConsultSubscription) {
      this.getQuickConsultSubscription.unsubscribe();
    }
    if (this.rbsSelectedInInvestigationSubscription) {
      this.rbsSelectedInInvestigationSubscription.unsubscribe();
    }
    if (this.rbsTestResultCurrentSubscription) {
      this.rbsTestResultCurrentSubscription.unsubscribe();
    }
    this.nurseService.rbsTestResultFromDoctorFetch = null;
  }

  getPrescriptionForm() {
    this.drugPrescriptionForm = <FormGroup>(
      this.patientQuickConsultForm.controls['prescription']
    );
  }

  getPrescribedDrugs(): AbstractControl[] | null {
    const prescribedDrugsControl =
      this.drugPrescriptionForm.get('prescribedDrugs');
    return prescribedDrugsControl instanceof FormArray
      ? prescribedDrugsControl.controls
      : null;
  }

  getProvisionalDiagnosisList(): AbstractControl[] | null {
    const provisionalDiagnosisListControl = this.patientQuickConsultForm.get(
      'provisionalDiagnosisList'
    );
    return provisionalDiagnosisListControl instanceof FormArray
      ? provisionalDiagnosisListControl.controls
      : null;
  }

  addDiagnosis() {
    const diagnosisListForm = this.patientQuickConsultForm.controls[
      'provisionalDiagnosisList'
    ] as FormArray;
    if (diagnosisListForm.length < 30) {
      diagnosisListForm.push(this.utils.initProvisionalDiagnosisList());
    } else {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.maxDiagnosis
      );
    }
  }

  deleteDiagnosis(index: any, diagnosisList: AbstractControl<any, any>) {
    const diagnosisListForm = this.patientQuickConsultForm.controls[
      'provisionalDiagnosisList'
    ] as FormArray;
    if (!diagnosisListForm.at(index).invalid) {
      this.confirmationService
        .confirm(`warn`, this.currentLanguageSet.alerts.info.warn)
        .subscribe(result => {
          if (result) {
            if (diagnosisListForm.length > 1) {
              diagnosisListForm.removeAt(index);
            } else {
              diagnosisListForm.removeAt(index);
              diagnosisListForm.push(this.utils.initProvisionalDiagnosisList());
            }
          }
        });
    } else {
      if (diagnosisListForm.length > 1) {
        diagnosisListForm.removeAt(index);
      } else {
        diagnosisListForm.removeAt(index);
        diagnosisListForm.push(this.utils.initProvisionalDiagnosisList());
      }
    }
  }

  makeDurationMaster() {
    let i = 1;
    while (i <= 29) {
      this.drugDurationMaster.push(i);
      i++;
    }
  }

  displayFn(option: any): string {
    if (option) {
      return `${option.itemName} ${option.strength}${
        option.unitOfMeasurement ? option.unitOfMeasurement : ''
      }${option.quantityInHand ? '(' + option.quantityInHand + ')' : ''}`;
    } else {
      return '';
    }
  }

  getFormValueChanged() {
    this.clearCurrentDetails();
    this.getFormDetails();
  }
  getFormDetails() {
    this.currentPrescription['formID'] = this.tempform.itemFormID;
    this.currentPrescription['formName'] = this.tempform.itemFormName;
    this.filterDrugMaster();
    this.filterDoseMaster();
  }

  filterDrugMaster() {
    const drugMasterCopy = Object.assign([], this.drugMaster);
    this.filteredDrugMaster = [];
    drugMasterCopy.forEach((element: any) => {
      if (this.currentPrescription.formID === element.itemFormID) {
        element['isEDL'] = true;
        this.filteredDrugMaster.push(element);
      }
    });
    const drugMasterCopyEdl = Object.assign([], this.edlMaster);
    drugMasterCopyEdl.forEach((element: any) => {
      if (this.currentPrescription.formID === element.itemFormID) {
        element['quantityInHand'] = 0;
        this.filteredDrugMaster.push(element);
      }
    });
    this.subFilteredDrugMaster = this.filteredDrugMaster;
  }

  filterDoseMaster() {
    const drugDoseMasterCopy = Object.assign([], this.drugDoseMaster);
    this.filteredDrugDoseMaster = [];
    drugDoseMasterCopy.forEach((element: any) => {
      if (this.currentPrescription.formID === element.itemFormID) {
        this.filteredDrugDoseMaster.push(element);
      }
    });
  }

  filterMedicine(medicine: any) {
    if (medicine) {
      this.subFilteredDrugMaster = this.filteredDrugMaster.filter(
        (drug: any) => {
          return drug.itemName.toLowerCase().startsWith(medicine.toLowerCase());
        }
      );
    } else {
      this.subFilteredDrugMaster = this.filteredDrugMaster;
    }
  }

  reEnterMedicine() {
    if (this.tempDrugName && this.currentPrescription.drugID) {
      this.tempDrugName = {
        id: this.currentPrescription.id,
        itemName: this.currentPrescription.drugName,
        itemID: this.currentPrescription.drugID,
        quantityInHand: this.currentPrescription.quantity,
        strength: this.currentPrescription.drugStrength,
        unitOfMeasurement: this.currentPrescription.drugUnit,
        sctCode: this.currentPrescription.sctCode,
        sctTerm: this.currentPrescription.sctTerm,
      };
    } else if (this.tempDrugName && !this.currentPrescription.drugID) {
      this.tempDrugName = null;
    } else {
      this.clearCurrentDetails();
      this.getFormDetails();
    }
  }

  checkNotIssued(itemID: any) {
    const medicineValue =
      this.drugPrescriptionForm.controls['prescribedDrugs'].value;
    const filteredExisting = medicineValue.filter(
      (meds: any) => meds.drugID === itemID
    );
    if (filteredExisting.length > 0) {
      this.reEnterMedicine();
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.medicinePrescribe,
        'info'
      );
      return false;
    } else {
      return true;
    }
  }

  selectMedicineObject(event: any) {
    const option = event.source.value;
    if (event.isUserInput) {
      if (this.checkNotIssued(option.itemID)) {
        this.currentPrescription['id'] = option.id;
        this.currentPrescription['drugName'] = option.itemName;
        this.currentPrescription['drugID'] = option.itemID;
        this.currentPrescription['quantity'] = option.quantityInHand;
        this.currentPrescription['drugStrength'] = option.strength;
        this.currentPrescription['drugUnit'] = option.unitOfMeasurement;
        this.currentPrescription['sctCode'] = option.sctCode;
        this.currentPrescription['sctTerm'] = option.sctTerm;
        this.currentPrescription['isEDL'] = option.isEDL;
        const typeOfDrug = option.isEDL
          ? ''
          : this.currentLanguageSet.nonEDLMedicine;
        if (option.quantityInHand === 0) {
          this.confirmationService
            .confirm(
              'info ' + typeOfDrug,
              this.currentLanguageSet.stockNotAvailableWouldYouPrescribe +
                option.itemName +
                ' ' +
                option.strength +
                option.unitOfMeasurement
            )
            .subscribe(res => {
              if (!res) {
                this.tempDrugName = null;
                this.currentPrescription['id'] = '';
                this.currentPrescription['drugName'] = '';
                this.currentPrescription['drugID'] = '';
                this.currentPrescription['quantity'] = '';
                this.currentPrescription['drugStrength'] = '';
                this.currentPrescription['drugUnit'] = '';
                this.currentPrescription['sctCode'] = '';
                this.currentPrescription['sctTerm'] = '';
                this.isStockAvalable = '';
              } else {
                this.isStockAvalable = 'warn';
              }
            });
        } else {
          this.isStockAvalable = 'primary';
        }
      }
    }
  }

  clearCurrentDetails() {
    this.currentPrescription = {
      id: '',
      drugID: '',
      drugName: '',
      drugStrength: '',
      drugUnit: '',
      quantity: '',
      formID: '',
      route: '',
      qtyPrescribed: '',
      formName: '',
      dose: '',
      frequency: '',
      duration: '',
      unit: '',
      instructions: '',
      sctCode: '',
      sctTerm: '',
      isEDL: '',
    };
    this.tempDrugName = null;
    this.prescriptionForm.form.markAsUntouched();
    this.isStockAvalable = '';
  }

  submitForUpload() {
    this.addMedicine();
    this.tempform = null;
    this.clearCurrentDetails();
    // this.currentPrescription = {
    //   id: null,
    //   drugID: null,
    //   drugName: null,
    //   drugStrength: null,
    //   drugUnit: null,
    //   quantity: null,
    //   formID: null,
    //   formName: null,
    //   dose: null,
    //   frequency: null,
    //   duration: null,
    //   unit: null,
    //   instructions: null,
    // }
    // this.tempform = null;
    // this.tempDrugName = null;
    // this.prescriptionForm.form.markAsUntouched();
  }

  masterDataSubscription: any;
  loadMasterData() {
    this.masterDataSubscription =
      this.masterdataService.doctorMasterData$.subscribe(res => {
        if (res !== null) {
          this.masterData = res;
          this.chiefComplaintMaster = this.masterData.chiefComplaintMaster;
          this.chiefComplaintTemporarayList[0] =
            this.chiefComplaintMaster.slice();

          this.nonRadiologyMaster = this.masterData.procedures.filter(
            (item: any) => {
              return item.procedureType === 'Laboratory';
            }
          );
          this.radiologyMaster = this.masterData.procedures.filter(
            (item: any) => {
              return item.procedureType === 'Radiology';
            }
          );

          this.drugFormMaster = this.masterData.drugFormMaster;
          this.drugMaster = this.masterData.itemMaster;
          this.drugDoseMaster = this.masterData.drugDoseMaster;
          this.drugFrequencyMaster = this.masterData.drugFrequencyMaster;
          this.drugDurationUnitMaster = this.masterData.drugDurationUnitMaster;
          this.drugRouteMaster = this.masterData.routeOfAdmin;
          this.edlMaster = this.masterData.NonEdlMaster;

          this.loadVitalsFromNurse();
          if (this.quickConsultMode === 'view') {
            const beneficiaryRegID = localStorage.getItem('beneficiaryRegID');
            const visitID = localStorage.getItem('visitID');
            const visitCategory = localStorage.getItem('visitCategory');
            this.getDiagnosisDetails(beneficiaryRegID, visitID, visitCategory);
          }
        }
      });
  }

  diagnosisSubscription: any;
  getDiagnosisDetails(beneficiaryRegID: any, visitID: any, visitCategory: any) {
    this.diagnosisSubscription = this.doctorService
      .getCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory)
      .subscribe((res: any) => {
        if (res && res.statusCode === 200 && res.data) {
          this.patchDiagnosisDetails(res.data);
        }
      });
  }

  filterInitialComplaints(element: any) {
    const arr = this.chiefComplaintMaster.filter((item: any) => {
      return item.chiefComplaint === element.chiefComplaint;
    });

    if (arr.length > 0) {
      const index = this.chiefComplaintTemporarayList[0].indexOf(arr[0]);
      const index2 = this.chiefComplaintMaster.indexOf(arr[0]);

      if (index >= 0) this.chiefComplaintTemporarayList[0].splice(index, 1);

      if (index2 >= 0) this.chiefComplaintMaster.splice(index2, 1);
    }
  }

  patchDiagnosisDetails(response: any) {
    if (response) {
      const complaintDetails = response.findings;
      if (complaintDetails && complaintDetails.complaints) {
        this.benChiefComplaints = complaintDetails.complaints;
        this.dataSource.data = complaintDetails.complaints;
        this.dataSource.data.forEach(chiefComplaint => {
          this.filterInitialComplaints(chiefComplaint);
        });
      }

      const investigation = response.investigation;
      if (investigation && investigation.laboratoryList) {
        this.previousLabTestList = investigation.laboratoryList;
        const labTest: any = [];
        investigation.laboratoryList.forEach((item: any) => {
          const temp = this.masterData.procedures.filter((procedure: any) => {
            return procedure.procedureID === item.procedureID;
          });
          if (temp.length > 0) labTest.push(temp[0]);
          if (
            item.procedureName.toLowerCase() ===
            environment.RBSTest.toLowerCase()
          ) {
            this.rbsSelectedInInvestigation = true;
            this.nurseService.setRbsSelectedInInvestigation(true);
          }
        });

        const test = labTest.filter((item: any) => {
          return item.procedureType === 'Laboratory';
        });
        const radiology = labTest.filter((item: any) => {
          return item.procedureType === 'Radiology';
        });
        this.patientQuickConsultForm.patchValue({ test, radiology });
      }
      const findings = response.findings;
      const diagnosis = response.diagnosis;
      if (findings && findings.clinicalObservation) {
        this.patientQuickConsultForm.patchValue({
          clinicalObservation: findings.clinicalObservation,
        });
      }
      if (diagnosis && diagnosis.diagnosisProvided) {
        this.patientQuickConsultForm.patchValue({
          diagnosisProvided: diagnosis.diagnosisProvided,
        });
      }
      if (diagnosis && diagnosis.externalInvestigation) {
        this.patientQuickConsultForm.patchValue({
          externalInvestigation: diagnosis.externalInvestigation,
        });
      }
      if (diagnosis && diagnosis.instruction) {
        this.patientQuickConsultForm.patchValue({
          instruction: diagnosis.instruction,
        });
      }
      if (diagnosis && diagnosis.prescriptionID) {
        this.patientQuickConsultForm.patchValue({
          prescriptionID: diagnosis.prescriptionID,
        });
      }
      if (diagnosis && diagnosis.provisionalDiagnosisList) {
        const generalArray = this.patientQuickConsultForm.controls[
          'provisionalDiagnosisList'
        ] as FormArray;
        const previousArray = diagnosis.provisionalDiagnosisList;
        let j = 0;
        if (previousArray.length > 0) {
          previousArray.forEach((i: any) => {
            generalArray.at(j).patchValue({
              conceptID: i.conceptID,
              term: i.term,
              provisionalDiagnosis: i.term,
            });
            (<FormGroup>generalArray.at(j)).controls[
              'provisionalDiagnosis'
            ].disable();
            if (generalArray.length < previousArray.length) {
              this.addDiagnosis();
            }
            j++;
          });
        }
      }
      this.patchPrescriptionDetails(response.prescription);
    }
  }

  getQuickConsultSubscription: any;
  loadVitalsFromNurse() {
    this.getQuickConsultSubscription = this.doctorService
      .getGenericVitals({
        benRegID: localStorage.getItem('beneficiaryRegID'),
        benVisitID: localStorage.getItem('visitID'),
      })
      .subscribe(res => {
        if (
          res.data.benAnthropometryDetail !== null &&
          res.data.benPhysicalVitalDetail !== null
        ) {
          this.patientQuickConsultForm.patchValue({
            height_cm: res.data.benAnthropometryDetail.height_cm,
            weight_Kg: res.data.benAnthropometryDetail.weight_Kg,
            bMI: res.data.benAnthropometryDetail.bMI,
            temperature: res.data.benPhysicalVitalDetail.temperature,
            systolicBP_1stReading:
              res.data.benPhysicalVitalDetail.systolicBP_1stReading,
            diastolicBP_1stReading:
              res.data.benPhysicalVitalDetail.diastolicBP_1stReading,
            pulseRate: res.data.benPhysicalVitalDetail.pulseRate,
            respiratoryRate: res.data.benPhysicalVitalDetail.respiratoryRate,
            bloodGlucose_Fasting:
              res.data.benPhysicalVitalDetail.bloodGlucose_Fasting,
            bloodGlucose_Random:
              res.data.benPhysicalVitalDetail.bloodGlucose_Random,
            bloodGlucose_2hr_PP:
              res.data.benPhysicalVitalDetail.bloodGlucose_2hr_PP,
            sPO2: res.data.benPhysicalVitalDetail.sPO2,
            rbsTestResult: res.data.benPhysicalVitalDetail.rbsTestResult,
            rbsTestRemarks: res.data.benPhysicalVitalDetail.rbsTestRemarks,
          });
          this.nurseService.rbsTestResultFromDoctorFetch = null;
          if (
            res.data.benPhysicalVitalDetail.rbsTestResult !== undefined &&
            res.data.benPhysicalVitalDetail.rbsTestResult !== null
          ) {
            this.nurseService.rbsTestResultFromDoctorFetch =
              res.data.benPhysicalVitalDetail.rbsTestResult;
            this.rbsResultChange();
          }
          //Sending RBS Test Result to patch in Lab Reports
          if (res.data.benPhysicalVitalDetail) {
            this.testInVitalsService.setVitalsRBSValueInReports(
              res.data.benPhysicalVitalDetail
            );
          }
        }
      });
  }
  checkDiasableRBS() {
    if (
      this.rbsSelectedInInvestigation === true ||
      (this.nurseService.rbsTestResultFromDoctorFetch !== undefined &&
        this.nurseService.rbsTestResultFromDoctorFetch !== null)
    )
      return true;

    return false;
  }
  rbsResultChange(): boolean {
    if (
      this.patientQuickConsultForm.controls['rbsTestResult'].value &&
      this.patientQuickConsultForm.controls['rbsTestResult'].value !== null
    ) {
      this.nurseService.setRbsInCurrentVitals(
        this.patientQuickConsultForm.controls['rbsTestResult'].value
      );
      //this.patientVitalsForm.controls['rbsTestResult'].disable();
    } else {
      this.nurseService.setRbsInCurrentVitals(null);
    }
    if (
      this.rbsSelectedInInvestigation === true ||
      (this.nurseService.rbsTestResultFromDoctorFetch !== undefined &&
        this.nurseService.rbsTestResultFromDoctorFetch !== null)
    ) {
      this.patientQuickConsultForm.controls['rbsTestResult'].disable();
      this.patientQuickConsultForm.controls['rbsTestRemarks'].disable();
      return true; // disable the controls
    } else {
      this.patientQuickConsultForm.controls['rbsTestResult'].enable();
      this.patientQuickConsultForm.controls['rbsTestRemarks'].enable();
      return false; // enable the controls
    }
  }
  checkForRange() {
    if (
      this.rbsTestResult < 0 ||
      (this.rbsTestResult > 1000 && !this.rbsPopup)
    ) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
  }
  get bMI() {
    return this.patientQuickConsultForm.controls['bMI'].value;
  }

  get systolicBP_1stReading() {
    return this.patientQuickConsultForm.controls['systolicBP_1stReading'].value;
  }

  get diastolicBP_1stReading() {
    return this.patientQuickConsultForm.controls['diastolicBP_1stReading']
      .value;
  }

  get pulseRate() {
    return this.patientQuickConsultForm.controls['pulseRate'].value;
  }

  get respiratoryRate() {
    return this.patientQuickConsultForm.controls['respiratoryRate'].value;
  }

  get bloodGlucose_Fasting() {
    return this.patientQuickConsultForm.controls['bloodGlucose_Fasting'].value;
  }

  get bloodGlucose_Random() {
    return this.patientQuickConsultForm.controls['bloodGlucose_Random'].value;
  }

  get bloodGlucose_2hr_PP() {
    return this.patientQuickConsultForm.controls['bloodGlucose_2hr_PP'].value;
  }

  get rbsTestRemarks() {
    return this.patientQuickConsultForm.controls['rbsTestRemarks'].value;
  }

  get temperature() {
    return this.patientQuickConsultForm.controls['temperature'].value;
  }

  get rbsTestResult() {
    return this.patientQuickConsultForm.controls['rbsTestResult'].value;
  }
  get sPO2() {
    return this.patientQuickConsultForm.controls['sPO2'].value;
  }
  addMedicine() {
    const medicine: FormArray = <FormArray>(
      this.drugPrescriptionForm.controls['prescribedDrugs']
    );
    medicine.insert(
      0,
      this.utils.initMedicineWithData(
        Object.assign({}, this.currentPrescription, {
          createdBy: this.createdBy,
        })
      )
    );
  }

  setLimits(pageNo = 0) {
    this.pageLimits[0] = +pageNo * +this.pageSize;
    this.pageLimits[1] = (+pageNo + 1) * +this.pageSize;
  }

  deleteMedicine(i: any, id?: null) {
    this.confirmationService
      .confirm('warn', this.currentLanguageSet.alerts.info.confirmDelete)
      .subscribe(res => {
        if (res && id) {
          this.deleteMedicineBackend(i, id);
        } else if (res && !id) {
          this.deleteMedicineUI(i);
        }
      });
  }

  deleteMedicineUI(i: any) {
    const prescribedDrugs = <FormArray>(
      this.drugPrescriptionForm.controls['prescribedDrugs']
    );
    prescribedDrugs.removeAt(i);
  }
  deleteMedicineBackend(index: any, id: any) {
    this.doctorService.deleteMedicine(id).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.deleteMedicineUI(index);
      }
    });
  }

  patchPrescriptionDetails(prescription: any) {
    const medicine: FormArray = <FormArray>(
      this.drugPrescriptionForm.controls['prescribedDrugs']
    );
    prescription.forEach((element: any) => {
      medicine.insert(0, this.utils.initMedicineWithData(element, element.id));
    });
  }

  getSnomedCTRecord(chiefComplaint: any, i: any) {
    this.masterdataService
      .getSnomedCTRecord(chiefComplaint)
      .subscribe((snomedCT: any) => {
        if (snomedCT && snomedCT.data && snomedCT.data.conceptID) {
          const complaintFormArray = <FormArray>(
            this.patientQuickConsultForm.controls['chiefComplaintList']
          );
          complaintFormArray.controls[i].patchValue({
            conceptID: snomedCT.data.conceptID,
          });
        }
      });
  }

  filterComplaints(chiefComplaintValue: any, i: any) {
    this.getSnomedCTRecord(chiefComplaintValue.chiefComplaint, i);
    this.suggestChiefComplaintList(
      this.fb.group({ chiefComplaint: chiefComplaintValue }),
      i
    );

    const arr = this.chiefComplaintMaster.filter((item: any) => {
      return item.chiefComplaint === chiefComplaintValue.chiefComplaint;
    });

    if (this.selectedChiefComplaintList && this.selectedChiefComplaintList[i]) {
      this.chiefComplaintTemporarayList.map((item: any, t: any) => {
        if (t !== i) {
          item.push(this.selectedChiefComplaintList[i]);
          this.sortChiefComplaintList(item);
        }
      });
    }

    if (arr.length > 0) {
      this.chiefComplaintTemporarayList.map((item: any, t: any) => {
        const index = item.indexOf(arr[0]);
        if (index !== -1 && t !== i) item = item.splice(index, 1);
      });
      this.selectedChiefComplaintList[i] = arr[0];
    }
  }

  addChiefComplaint() {
    const complaintFormArray = <FormArray>(
      this.patientQuickConsultForm.controls['chiefComplaintList']
    );
    const complaintFormArrayValue = complaintFormArray.value;
    const temp = this.chiefComplaintMaster.filter((item: any) => {
      const arr = complaintFormArrayValue.filter((value: any) => {
        return value.chiefComplaint.chiefComplaint === item.chiefComplaint;
      });
      const flag = arr.length === 0 ? true : false;
      return flag;
    });
    if (temp.length > 0) {
      this.chiefComplaintTemporarayList.push(temp);
    }
    complaintFormArray.push(this.utils.initChiefComplaint());
  }

  deleteChiefComplaint(i: number, complaintForm: AbstractControl<any, any>) {
    this.confirmationService
      .confirm(`warn`, this.currentLanguageSet.alerts.info.warn)
      .subscribe(result => {
        if (result) {
          const complaintFormArray = <FormArray>(
            this.patientQuickConsultForm.controls['chiefComplaintList']
          );
          this.patientQuickConsultForm.markAsDirty();

          let arr: any = [];
          if (complaintForm.value.chiefComplaint) {
            arr = this.chiefComplaintMaster.filter((item: any) => {
              return (
                item.chiefComplaint ===
                complaintForm.value.chiefComplaint.chiefComplaint
              );
            });
          }
          if (arr.length > 0) {
            this.chiefComplaintTemporarayList.forEach(
              (element: any, t: any) => {
                if (t !== i) element.push(arr[0]);
                this.sortChiefComplaintList(element);
              }
            );
          }

          if (this.selectedChiefComplaintList[i])
            this.selectedChiefComplaintList[i] = null;

          if (this.suggestedChiefComplaintList[i])
            this.suggestedChiefComplaintList[i] = null;

          if (complaintFormArray.length === 1 && complaintForm)
            complaintForm.reset();
          else complaintFormArray.removeAt(i);
        }
      });
  }

  displayDrugName(drug: any) {
    return drug && drug.drugDisplayName;
  }

  canDisableTest(test: any) {
    if (
      ((this.rbsTestResultCurrent !== null &&
        this.rbsTestResultCurrent !== undefined) ||
        this.nurseService.rbsTestResultFromDoctorFetch !== null) &&
      test.procedureName === environment.RBSTest
    ) {
      // test.checked=true;
      return true;
    }
    // else if(((this.rbsTestResultCurrent === null || this.rbsTestResultCurrent === undefined) &&
    // this.nurseService.rbsTestResultFromDoctorFetch ==null) && test.procedureName === environment.RBSTest)
    // {
    //   test.checked=false;
    // }
    if (this.previousLabTestList) {
      const temp = this.previousLabTestList.filter((item: any) => {
        return item.procedureID === test.procedureID;
      });

      if (temp.length > 0) test.disabled = true;
      else test.disabled = false;

      return temp.length > 0;
    }
    return false;
  }

  canDisableComplaints(complaints: any) {
    if (this.previousChiefComplaints) {
      const temp = this.previousChiefComplaints.filter((item: any) => {
        return complaints.chiefComplaintID === item.chiefComplaintID;
      });

      if (temp.length > 0) complaints.disabled = true;
      else complaints.disabled = false;

      return temp.length > 0;
    } else {
      // Handle the case where this.previousChiefComplaints is null or undefined
      // You may return false or any other appropriate value
      return false;
    }
  }

  validateDrug(drugName: any, medicine: FormGroup) {
    if (typeof drugName === 'string') {
      medicine.patchValue({ drug: null });
    }
  }

  checkDrugFormValidity(drugForm: any) {
    const temp = drugForm.value;
    if (
      temp.drug &&
      temp.drugForm &&
      temp.dose &&
      temp.frequency &&
      temp.drugDuration &&
      temp.drugDurationUnit &&
      temp.specialInstruction
    ) {
      return false;
    } else {
      return true;
    }
  }

  displayChiefComplaint(complaint: any) {
    return complaint && complaint.chiefComplaint;
  }

  suggestChiefComplaintList(complaintForm: AbstractControl<any, any>, i: any) {
    const complaintFormArray = <FormArray>(
      this.patientQuickConsultForm.controls['chiefComplaintList']
    );

    if (
      complaintForm.value.chiefComplaint !== null &&
      complaintForm.value.chiefComplaint !== undefined &&
      complaintForm.value.chiefComplaint !== ''
    ) {
      const complaint = complaintForm.value.chiefComplaint;
      if (typeof complaint === 'string') {
        if (
          this.chiefComplaintTemporarayList !== undefined &&
          this.chiefComplaintTemporarayList !== null
        ) {
          this.suggestedChiefComplaintList[i] =
            this.chiefComplaintTemporarayList[i].filter(
              (compl: any) =>
                compl.chiefComplaint
                  .toLowerCase()
                  .indexOf(complaint.toLowerCase().trim()) >= 0
            );
        }
      } else if (typeof complaint === 'object' && complaint) {
        if (
          this.chiefComplaintTemporarayList !== undefined &&
          this.chiefComplaintTemporarayList !== null
        ) {
          this.suggestedChiefComplaintList[i] =
            this.chiefComplaintTemporarayList[i].filter(
              (compl: any) =>
                compl.chiefComplaint
                  .toLowerCase()
                  .indexOf(complaint.chiefComplaint.toLowerCase().trim()) >= 0
            );
        }
      }

      if (this.suggestedChiefComplaintList[i].length === 0)
        complaintForm.reset();
    } else {
      // if(complaintFormArray.controls.length>1 && i==0)
      // {
      //       this.deleteChiefComplaintRow(i,complaintForm)
      // }
      // else{
      complaintFormArray.controls[i].patchValue({
        conceptID: null,
        description: null,
      });
      // }
    }
  }

  deleteChiefComplaintRow(i: number, complaintForm: FormGroup) {
    const complaintFormArray = <FormArray>(
      this.patientQuickConsultForm.controls['chiefComplaintList']
    );
    this.patientQuickConsultForm.markAsDirty();

    let arr: any = [];
    if (complaintForm.value.chiefComplaint) {
      arr = this.chiefComplaintMaster.filter((item: any) => {
        return (
          item.chiefComplaint ===
          complaintForm.value.chiefComplaint.chiefComplaint
        );
      });
    }
    if (arr.length > 0) {
      this.chiefComplaintTemporarayList.forEach((element: any, t: any) => {
        if (t !== i) element.push(arr[0]);
        this.sortChiefComplaintList(element);
      });
    }

    if (this.selectedChiefComplaintList[i])
      this.selectedChiefComplaintList[i] = null;

    if (this.suggestedChiefComplaintList[i])
      this.suggestedChiefComplaintList[i] = null;

    if (complaintFormArray.length === 1 && complaintForm) complaintForm.reset();
    else complaintFormArray.removeAt(i);
  }

  sortChiefComplaintList(complaintList: any) {
    complaintList.sort((a: any, b: any) => {
      if (a.chiefComplaint === b.chiefComplaint) return 0;
      if (a.chiefComplaint < b.chiefComplaint) return -1;
      else return 1;
    });
  }

  getChiefComplaintList(): AbstractControl[] | null {
    const chiefComplaintListControl =
      this.patientQuickConsultForm.get('chiefComplaintList');
    return chiefComplaintListControl instanceof FormArray
      ? chiefComplaintListControl.controls
      : null;
  }

  checkProvisionalDiagnosisValidity(diagnosis: any) {
    const tempDiagnosis = diagnosis.value;
    if (tempDiagnosis.conceptID && tempDiagnosis.term) {
      return false;
    } else {
      return true;
    }
  }

  checkComplaintFormValidity(complaintForm: any) {
    if (complaintForm) {
      const temp = complaintForm?.value;
      if (temp && temp.chiefComplaint && temp.conceptID) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  checkTestName(event: any) {
    console.log('testName', event);
    const item = event.value;
    this.rbsSelectedInInvestigation = false;
    this.nurseService.setRbsSelectedInInvestigation(false);
    item.forEach((element: any) => {
      if (
        element.procedureName.toLowerCase() ===
        environment.RBSTest.toLowerCase()
      ) {
        this.rbsSelectedInInvestigation = true;
        this.nurseService.setRbsSelectedInInvestigation(true);
      }
    });
  }
}

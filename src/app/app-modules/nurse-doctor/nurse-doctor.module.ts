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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { NurseDoctorRoutingModule } from './nurse-doctor-routing.module';
import { DoctorService } from './shared/services/doctor.service';
import { MasterdataService, NurseService } from './shared/services';
import { WorkareaCanActivate } from './workarea/workarea-can-activate.service';
import { HttpServiceService } from '../core/services/http-service.service';
import { TestInVitalsService } from './shared/services/test-in-vitals.service';
import { IdrsscoreService } from './shared/services/idrsscore.service';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModule } from '../core/material.module';
import { NurseWorklistComponent } from './nurse-worklist/nurse-worklist.component';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { NurseWorklistTabsComponent } from './nurse-worklist-tabs/nurse-worklist-tabs.component';
import { NurseRefferedWorklistComponent } from './nurse-worklist-tabs/nurse-reffered-worklist/nurse-reffered-worklist.component';
import { WorkareaComponent } from './workarea/workarea.component';
import { VisitDetailsComponent } from './visit-details/visit-details.component';
import { PatientVisitDetailsComponent } from './visit-details/visit-details/visit-details.component';
import { CovidVaccinationStatusComponent } from './visit-details/covid-vaccination-status/covid-vaccination-status.component';
import { ChiefComplaintsComponent } from './visit-details/chief-complaints/chief-complaints.component';
import { AdherenceComponent } from './visit-details/adherence/adherence.component';
import { InvestigationsComponent } from './visit-details/investigations/investigations.component';
import { SymptomsComponent } from './visit-details/symptoms/symptoms.component';
import { ContactHistoryComponent } from './visit-details/contact-history/contact-history.component';
import { TravelHistoryComponent } from './visit-details/travel-history/travel-history.component';
import { UploadFilesComponent } from './visit-details/upload-files/upload-files.component';
import { MatChipsModule } from '@angular/material/chips';
import { DiseaseconfirmationComponent } from './visit-details/diseaseconfirmation/diseaseconfirmation.component';
import { DoctorWorklistComponent } from './doctor-worklist/doctor-worklist.component';
import { GeneralReferComponent } from './refer/general-refer/general-refer.component';
import { ReferComponent } from './refer/refer.component';
import { CancerReferComponent } from './refer/cancer-refer/cancer-refer.component';
import { CancerCaseRecordComponent } from './case-record/cancer-case-record/cancer-case-record.component';
import { GeneralCaseRecordComponent } from './case-record/general-case-record/general-case-record.component';
import { BeneficiaryPlatformHistoryComponent } from './case-record/beneficiary-platform-history/beneficiary-platform-history.component';
import { BeneficiaryMctsCallHistoryComponent } from './case-record/beneficiary-mcts-call-history/beneficiary-mcts-call-history.component';
import { CaseRecordComponent } from './case-record/case-record.component';
import { TestAndRadiologyComponent } from './case-record/general-case-record/test-and-radiology/test-and-radiology.component';
import { ViewTestReportComponent } from './case-record/general-case-record/test-and-radiology/view-test-report/view-test-report.component';
import { PreviousVisitDetailsComponent } from './case-record/general-case-record/previous-visit-details/previous-visit-details.component';
import { PreviousSignificiantFindingsComponent } from './case-record/general-case-record/previous-significiant-findings/previous-significiant-findings.component';
import { PrescriptionComponent } from './case-record/general-case-record/prescription/prescription.component';
import { FindingsComponent } from './case-record/general-case-record/findings/findings.component';
import { DiagnosisComponent } from './case-record/general-case-record/diagnosis/diagnosis.component';
import { DoctorInvestigationsComponent } from './case-record/general-case-record/doctor-investigations/doctor-investigations.component';
import { GeneralOpdDiagnosisComponent } from './case-record/general-case-record/diagnosis/general-opd-diagnosis/general-opd-diagnosis.component';
import { AncDiagnosisComponent } from './case-record/general-case-record/diagnosis/anc-diagnosis/anc-diagnosis.component';
import { NcdCareDiagnosisComponent } from './case-record/general-case-record/diagnosis/ncd-care-diagnosis/ncd-care-diagnosis.component';
import { PncDiagnosisComponent } from './case-record/general-case-record/diagnosis/pnc-diagnosis/pnc-diagnosis.component';
import { CovidDiagnosisComponent } from './case-record/general-case-record/diagnosis/covid-diagnosis/covid-diagnosis.component';
import { NcdScreeningDiagnosisComponent } from './case-record/general-case-record/diagnosis/ncd-screening-diagnosis/ncd-screening-diagnosis.component';
import { LabService } from '../lab/shared/services';

@NgModule({
  imports: [
    CommonModule,
    // ChartsModule,
    NurseDoctorRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    HttpClientModule,
    MaterialModule,
    MatTableModule,
    MatChipsModule,
  ],
  declarations: [
    NurseWorklistComponent,
    // PrintPageSelectComponent,
    // QuickConsultComponent,
    // CancerExaminationComponent,
    // GynecologicalExaminationComponent,
    // AbdominalExaminationComponent,
    // BreastExaminationComponent,
    // OralExaminationComponent,
    // SignsAndSymptomsComponent,
    // ObstetricExaminationComponent,
    // GenitoUrinarySystemComponent,
    // CentralNervousSystemComponent,
    // MusculoskeletalSystemComponent,
    // RespiratorySystemComponent,
    // GastroIntestinalSystemComponent,
    // CardioVascularSystemComponent,
    // SystemicExaminationComponent,
    // HeadToToeExaminationComponent,
    // GeneralExaminationComponent,
    // GeneralOpdExaminationComponent,
    // CancerPatientVitalsComponent,
    // GeneralPatientVitalsComponent,
    // MedicationHistoryComponent,
    // DevelopmentHistoryComponent,
    // FeedingHistoryComponent,
    // OtherVaccinesComponent,
    // ImmunizationHistoryComponent,
    // PastObstericHistoryComponent,
    // PerinatalHistoryComponent,
    // MenstrualHistoryComponent,
    // FamilyHistoryComponent,
    // ComorbidityConcurrentConditionsComponent,
    // GeneralPersonalHistoryComponent,
    // PastHistoryComponent,
    // GeneralOpdHistoryComponent,
    // CancerHistoryComponent,
    // ObstetricHistoryComponent,
    // FamilyDiseaseHistoryComponent,
    // PersonalHistoryComponent,
    DoctorWorklistComponent,
    // AncComponent,
    // AncDetailsComponent,
    // AncImmunizationComponent,
    // ObstetricFormulaComponent,
    VisitDetailsComponent,
    PatientVisitDetailsComponent,
    // VisitCategoryComponent,
    ChiefComplaintsComponent,
    AdherenceComponent,
    InvestigationsComponent,
    UploadFilesComponent,
    // HistoryComponent,
    // ExaminationComponent,
    // VitalsComponent,
    CaseRecordComponent,
    // AncComponent,
    // PncComponent,
    // NcdScreeningComponent,
    // DashboardComponent,
    WorkareaComponent,
    CancerCaseRecordComponent,
    GeneralCaseRecordComponent,
    CancerReferComponent,
    GeneralReferComponent,
    // CancerCaseSheetComponent,
    // GeneralCaseSheetComponent,
    ReferComponent,
    // PrintPageSelectComponent,
    PreviousVisitDetailsComponent,
    FindingsComponent,
    DiagnosisComponent,
    PrescriptionComponent,
    DoctorInvestigationsComponent,
    TestAndRadiologyComponent,
    // RadiologistWorklistComponent,
    // OncologistWorklistComponent,
    GeneralOpdDiagnosisComponent,
    AncDiagnosisComponent,
    // CaseSheetComponent,
    NcdCareDiagnosisComponent,
    PncDiagnosisComponent,
    PreviousSignificiantFindingsComponent,
    ViewTestReportComponent,
    // HistoryCaseSheetComponent,
    // ExaminationCaseSheetComponent,
    // AncCaseSheetComponent,
    // PncCaseSheetComponent,
    // DoctorDiagnosisCaseSheetComponent,
    // ImageToCanvasComponent,
    // CancerDoctorDiagnosisCaseSheetComponent,
    // CancerHistoryCaseSheetComponent,
    // CancerExaminationCaseSheetComponent,
    BeneficiaryMctsCallHistoryComponent,
    BeneficiaryPlatformHistoryComponent,
    // ReportsComponent,
    TravelHistoryComponent,
    ContactHistoryComponent,
    SymptomsComponent,
    CovidDiagnosisComponent,
    // IdrsComponent,
    NcdScreeningDiagnosisComponent,
    // PhysicalActivityHistoryComponent,
    // FamilyHistoryNcdscreeningComponent,
    NurseWorklistTabsComponent,
    NurseRefferedWorklistComponent,
    DiseaseconfirmationComponent,
    // TmcconfirmationComponent,
    // TmVisitDetailsComponent,
    // PrescribeTmMedicineComponent,
    CovidVaccinationStatusComponent,
  ],

  providers: [
    NurseService,
    DoctorService,
    MasterdataService,
    WorkareaCanActivate,
    HttpServiceService,
    IdrsscoreService,
    TestInVitalsService,
    LabService,
  ],
  // entryComponents: [PrintPageSelectComponent, ViewTestReportComponent, BeneficiaryMctsCallHistoryComponent, PrescribeTmMedicineComponent]
})
export class NurseDoctorModule {}

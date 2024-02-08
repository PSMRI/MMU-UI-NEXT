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
    // DoctorWorklistComponent,
    // AncComponent,
    // AncDetailsComponent,
    // AncImmunizationComponent,
    // ObstetricFormulaComponent,
    // VisitDetailsComponent,
    // VisitCategoryComponent,
    // ChiefComplaintsComponent,
    // AdherenceComponent,
    // InvestigationsComponent,
    // UploadFilesComponent,
    // HistoryComponent,
    // ExaminationComponent,
    // VitalsComponent,
    // CaseRecordComponent,
    // AncComponent,
    // PncComponent,
    // NcdScreeningComponent,
    // DashboardComponent,
    // WorkareaComponent,
    // CancerCaseRecordComponent,
    // GeneralCaseRecordComponent,
    // CancerReferComponent,
    // GeneralReferComponent,
    // CancerCaseSheetComponent,
    // GeneralCaseSheetComponent,
    // ReferComponent,
    // PrintPageSelectComponent,
    // PreviousVisitDetailsComponent,
    // FindingsComponent,
    // DiagnosisComponent,
    // PrescriptionComponent,
    // DoctorInvestigationsComponent,
    // TestAndRadiologyComponent,
    // RadiologistWorklistComponent,
    // OncologistWorklistComponent,
    // GeneralOpdDiagnosisComponent,
    // AncDiagnosisComponent,
    // CaseSheetComponent,
    // NcdCareDiagnosisComponent,
    // PncDiagnosisComponent,
    // PreviousSignificiantFindingsComponent,
    // ViewTestReportComponent,
    // HistoryCaseSheetComponent,
    // ExaminationCaseSheetComponent,
    // AncCaseSheetComponent,
    // PncCaseSheetComponent,
    // DoctorDiagnosisCaseSheetComponent,
    // ImageToCanvasComponent,
    // CancerDoctorDiagnosisCaseSheetComponent,
    // CancerHistoryCaseSheetComponent,
    // CancerExaminationCaseSheetComponent,
    // BeneficiaryMctsCallHistoryComponent,
    // BeneficiaryPlatformHistoryComponent,
    // ReportsComponent,
    // TravelHistoryComponent,
    // ContactHistoryComponent,
    // SymptomsComponent,
    // CovidDiagnosisComponent,
    // IdrsComponent,
    // NcdScreeningDiagnosisComponent,
    // PhysicalActivityHistoryComponent,
    // FamilyHistoryNcdscreeningComponent,
    NurseWorklistTabsComponent,
    NurseRefferedWorklistComponent,
    // DiseaseconfirmationComponent,
    // TmcconfirmationComponent,
    // TmVisitDetailsComponent,
    // PrescribeTmMedicineComponent,
    // CovidVaccinationStatusComponent
  ],

  providers: [
    NurseService,
    DoctorService,
    MasterdataService,
    WorkareaCanActivate,
    HttpServiceService,
    IdrsscoreService,
    TestInVitalsService,
  ],
  // entryComponents: [PrintPageSelectComponent, ViewTestReportComponent, BeneficiaryMctsCallHistoryComponent, PrescribeTmMedicineComponent]
})
export class NurseDoctorModule {}

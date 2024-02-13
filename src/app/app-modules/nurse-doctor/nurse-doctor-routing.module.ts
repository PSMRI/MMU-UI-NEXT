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
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../registrar/dashboard/dashboard.component';
import { WorkareaComponent } from './workarea/workarea.component';
import { WorkareaCanActivate } from './workarea/workarea-can-activate.service';
import { CanDeactivateGuardService } from '../core/services/can-deactivate-guard.service';
import { NurseWorklistComponent } from './nurse-worklist/nurse-worklist.component';
import { NurseWorklistTabsComponent } from './nurse-worklist-tabs/nurse-worklist-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'nurse-worklist',
        pathMatch: 'full',
      },
      // {
      //   path: 'nurse-worklist',
      //   component: NurseWorklistComponent,
      // },
      {
        path: 'nurse-worklist',
        component: NurseWorklistTabsComponent,
      },
      // {
      //   path: 'doctor-worklist',
      //   component: DoctorWorklistComponent
      // },
      // {
      //   path: 'radiologist-worklist',
      //   component: RadiologistWorklistComponent
      // },
      // {
      //   path: 'oncologist-worklist',
      //   component: OncologistWorklistComponent
      // },
      // {
      //   path: 'reports',
      //   component: ReportsComponent
      // },
      {
        path: 'attendant/:attendant/patient/:beneficiaryRegID',
        component: WorkareaComponent,
        canActivate: [WorkareaCanActivate],
        canDeactivate: [CanDeactivateGuardService],
      },
    ],
  },
  // {
  //   path: 'print/:serviceType/:printablePage',
  //   component: CaseSheetComponent
  // },
  // {
  //   path: 'generalcaserec',
  //   component: GeneralCaseRecordComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NurseDoctorRoutingModule {}

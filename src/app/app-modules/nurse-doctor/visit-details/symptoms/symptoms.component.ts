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
  DoCheck,
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import {
  MasterdataService,
  NurseService,
  DoctorService,
} from '../../shared/services';
import { SetLanguageComponent } from 'src/app/app-modules/core/components/set-language.component';
import { HttpServiceService } from 'src/app/app-modules/core/services/http-service.service';

@Component({
  selector: 'app-symptoms',
  templateUrl: './symptoms.component.html',
  styleUrls: ['./symptoms.component.css'],
})
export class SymptomsComponent implements OnInit {
  @Input()
  patientCovidForm!: FormGroup;
  symptomsList: any = [];
  sympFlag: boolean = false;
  @Input()
  mode!: string;

  @Output() filter: EventEmitter<any> = new EventEmitter<any>();
  symptomsArray!: string[];
  symptoms: any;
  answer1!: any;
  symptomsarray!: any[];
  currentLanguageSet: any;

  constructor(
    private fb: FormBuilder,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    private masterdataService: MasterdataService,
    private httpServices: HttpServiceService
  ) {}

  disable: any = ['false', 'false', 'false', 'false'];
  checked: boolean[] = [false, false, false, false];

  ngOnInit() {
    this.assignSelectedLanguage();
    localStorage.setItem('symptom', 'null');

    this.disable = ['false', 'false', 'false', 'false'];
    this.checked = [false, false, false, false];
    this.getMasterData();
  }
  /*
   * JA354063 - Multilingual Changes added on 13/10/21
   */
  DoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  // Ends
  OnChanges() {
    if (this.mode == 'view') {
      const visitID = localStorage.getItem('visitID');
      const benRegID = localStorage.getItem('beneficiaryRegID');
      this.getHistoryDetails(benRegID, visitID);
    }
  }
  OnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.coividSymptomsHistory) this.coividSymptomsHistory.unsubscribe();
  }
  covidSymptoms: any;
  coividSymptomsHistory: any;
  getHistoryDetails(beneficiaryRegID: any, visitID: any) {
    this.coividSymptomsHistory = this.doctorService
      .getVisitComplaintDetails(beneficiaryRegID, visitID)
      .subscribe((value: any) => {
        if (
          value != null &&
          value.statusCode == 200 &&
          value.data != null &&
          value.data.covidDetails != null
        ) {
          console.log('coviddata', value.data.covidDetails.symptom);
          this.sympFlag = true;
          this.covidSymptoms = value.data.covidDetails.symptom;
          // this.patientCovidForm.patchValue({'symptom' : this.covidSymptoms});
          this.patientCovidForm.patchValue({
            symptom: value.data.covidDetails.symptom,
          });
        }
      });
  }
  symptomSelected() {
    console.log('SymptomLength' + this.symptom.length);
    if (this.symptom.length != 0) {
      if (this.symptom.indexOf('No Symptoms') > -1) {
        localStorage.setItem('symptom', 'false');

        this.symptomsList = this.symptomsList.filter((item: any) => {
          return item == 'No Symptoms';
        });
        //this.answer1=true;
      } else {
        localStorage.setItem('symptom', 'true'); //change

        this.symptomsList = this.symptomsList.filter((item: any) => {
          return item != 'No Symptoms';
        });
        if (this.symptom.length == 3) {
          localStorage.setItem('allSymptom', 'true');
        } else {
          localStorage.setItem('allSymptom', 'false');
        }
      }
      this.answer1 = localStorage.getItem('symptom');
      //this.outputToParent.emit( this.answer1);
      this.masterdataService.filter(this.answer1);
    } else {
      this.symptomsList = this.symptomsArray;
      localStorage.setItem('symptom', 'null');
      localStorage.setItem('allSymptom', 'null');
      this.answer1 = localStorage.getItem('symptom');
      //this.outputToParent.emit( this.answer1);
      this.masterdataService.filter(this.answer1);
    }
  }
  masterData: any;
  nurseMasterDataSubscription: any;
  getMasterData() {
    this.nurseMasterDataSubscription =
      this.masterdataService.nurseMasterData$.subscribe(masterData => {
        if (masterData && masterData.covidSymptomsMaster) {
          console.log('covidSymptomsMaster =' + masterData.covidSymptomsMaster);

          this.masterData = masterData;
          this.symptomsarray = this.masterData.covidSymptomsMaster;
          for (let i = 0; i < this.symptomsarray.length; i++) {
            console.log(this.symptomsarray[i]['symptoms']);
            this.symptomsList.push(this.symptomsarray[i]['symptoms']);
          }
          this.symptomsArray = this.symptomsList;
          console.log('symptomsArray');
          console.log(this.symptomsArray);
          console.log('symptomsarray');
          console.log(this.symptomsList);
          console.log(masterData.covidSymptomsMaster);
          console.log(this.symptomsList[0]);
          console.log(this.symptomsList[0]['symptoms']);
          // if (this.mode) {
          //   let visitID = localStorage.getItem("visitID");
          //   let benRegID = localStorage.getItem("beneficiaryRegID");
          //   this.patchDataToFields(benRegID, visitID);
          // }
        }
      });
  }

  get symptom() {
    return this.patientCovidForm.controls['symptom'].value;
  }
}

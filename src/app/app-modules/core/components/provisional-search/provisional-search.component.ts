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

import { Component, OnInit, Inject, DoCheck, ViewChild } from '@angular/core';
import { MasterdataService } from '../../../nurse-doctor/shared/services/masterdata.service';
import { Observable, Subject } from 'rxjs';
import { SpinnerService } from '../../services/spinner.service';
import { HttpServiceService } from '../../services/http-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SetLanguageComponent } from '../set-language.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-provisional-search',
  templateUrl: './provisional-search.component.html',
  styleUrls: ['./provisional-search.component.css'],
})
export class ProvisionalSearchComponent implements OnInit, DoCheck {
  searchTerm: any;
  // diagnosis$: Observable<any>;
  // diagnosis:any = [];
  pageCount: any;
  selectedDiagnosisList: any = [];
  disableDiagnosisList: any = [];
  current_language_set: any;
  displayedColumns: any = ['ConceptID', 'term', 'empty'];
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  diagnosis = new MatTableDataSource<any>();

  // currentAppPage: number = 1;
  // appPerPage: number = 10;
  // pageSize: number = 10;

  constructor(
    @Inject(MAT_DIALOG_DATA) public input: any,
    public dialogRef: MatDialogRef<ProvisionalSearchComponent>,
    private masterdataService: MasterdataService,
    public httpServiceService: HttpServiceService,
    private spinnerService: SpinnerService
  ) {}
  placeHolderSearch: any;
  ngOnInit() {
    this.assignSelectedLanguage();
    this.search(this.input.searchTerm, 0);
    if (this.input.diagonasisType)
      this.placeHolderSearch = this.input.diagonasisType;
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
  }

  selectDiagnosis(event: any, item: any) {
    if (event.checked) {
      item.selected = true;
      this.selectedDiagnosisList.push(item);
    } else {
      const index = this.selectedDiagnosisList.indexOf(item);
      this.selectedDiagnosisList.splice(index, 1);
      item.selected = false;
    }
  }

  disableSelection(item: any) {
    const addedDiagnosis = this.input.addedDiagnosis;
    const temp = addedDiagnosis.filter(
      (diagnosis: any) => diagnosis.conceptID === item.conceptID
    );
    if (temp.length > 0) {
      return true;
    } else {
      const currentSelection = this.selectedDiagnosisList.filter(
        (diagnosis: any) => diagnosis.conceptID === item.conceptID
      );
      const selectedDiagnosislength =
        this.input.addedDiagnosis.length +
        this.selectedDiagnosisList.length -
        1;
      if (currentSelection.length > 0) {
        return false;
      } else {
        if (selectedDiagnosislength < 30) {
          return false;
        } else {
          return true;
        }
      }
    }
  }

  selectedDiagnosis(item: any) {
    const addedDiagnosis = this.input.addedDiagnosis;
    const temp = addedDiagnosis.filter(
      (diagnosis: any) => diagnosis.conceptID === item.conceptID
    );
    if (temp.length > 0) return true;
    else {
      const currentSelection = this.selectedDiagnosisList.filter(
        (diagnosis: any) => diagnosis.conceptID === item.conceptID
      );
      if (currentSelection.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  submitDiagnosisList() {
    this.dialogRef.close(this.selectedDiagnosisList);
  }
  showProgressBar: boolean = false;
  search(term: string, pageNo: any): void {
    console.log(term);
    if (term.length > 2) {
      this.showProgressBar = true;
      this.masterdataService
        .searchDiagnosisBasedOnPageNo(term, pageNo)
        .subscribe(
          (res: any) => {
            if (res.statusCode === 200) {
              this.showProgressBar = false;
              if (res.data && res.data.sctMaster.length > 0) {
                this.showProgressBar = true;
                this.diagnosis.data = res.data.sctMaster;
                this.diagnosis.paginator = this.paginator;
                //   if (pageNo === 0) {
                //     this.pageCount = res.data.pageCount;
                //   }
                //   this.pager = this.getPager(pageNo);
                //   this.showProgressBar = false;
              }
            } else {
              this.resetData();
              this.showProgressBar = false;
            }
          },
          err => {
            this.resetData();
            this.showProgressBar = false;
          }
        );
    }
  }

  // checkPager(pager:any, page:any) {
  //   if (page === 0 && pager.currentPage != 0) {
  //     this.setPage(page);
  //   } else if (pager.currentPage < page) {
  //     this.setPage(page);
  //   }
  // }
  // setPage(page: number) {
  //   if (page <= this.pageCount - 1 && page >= 0) {
  //     this.search(this.input.searchTerm, page);
  //     // get pager object
  //     this.pager = this.getPager(page);
  //   }
  // }

  // getPager(page:any) {

  //   // Total page count
  //   let totalPages = this.pageCount;
  //   // ensure current page isn't out of range
  //   if (page > totalPages) {
  //     page = totalPages - 1;
  //   }
  //   let startPage: number, endPage: number;
  //   if (totalPages <= 5) {
  //     // less than 5 total pages so show all
  //     startPage = 0;
  //     endPage = totalPages - 1;
  //   } else {
  //     // more than 5 total pages so calculate start and end pages
  //     if (page <= 2) {
  //       startPage = 0;
  //       endPage = 4;
  //     } else if (page + 2 >= totalPages) {
  //       startPage = totalPages - 5;
  //       endPage = totalPages - 1;
  //     } else {
  //       startPage = page - 2;
  //       endPage = page + 2;
  //     }
  //   }
  //   // create an array of pages to ng-repeat in the pager control
  //   let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
  //   // return object with all pager properties required by the view
  //   return {
  //     currentPage: page,
  //     totalPages: totalPages,
  //     startPage: startPage,
  //     endPage: endPage,
  //     pages: pages
  //   };
  // }
  resetData() {
    this.diagnosis.data = [];
    this.diagnosis.paginator = this.paginator;
    // this.pageCount = null;
    // this.pager = {
    //   totalItems: 0,
    //   currentPage: 0,
    //   totalPages: 0,
    //   startPage: 0,
    //   endPage: 0,
    //   pages: 0
    // };
  }
}

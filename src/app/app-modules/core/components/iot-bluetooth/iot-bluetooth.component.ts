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

import { Component, OnInit, DoCheck } from '@angular/core';
import { HttpServiceService } from '../../services/http-service.service';
import { IotService } from '../../services/iot.service';
import { SetLanguageComponent } from '../set-language.component';
import { ConfirmationService } from '../../services';

@Component({
  selector: 'app-iot-bluetooth',
  templateUrl: './iot-bluetooth.component.html',
  styleUrls: ['./iot-bluetooth.component.css'],
})
export class IotBluetoothComponent implements OnInit, DoCheck {
  current_language_set: any;

  constructor(
    public service: IotService,
    public httpServiceService: HttpServiceService,
    private confirmationService: ConfirmationService
  ) {}

  apiAvailable: boolean = false;
  deviceConnected: boolean = false;
  deviceSearching: boolean = false;
  infoDetails!: any[];
  errMsg: any;
  bluetoothDevices!: string[];
  spinner!: boolean;
  boolean = false;
  ngOnInit() {
    this.assignSelectedLanguage();
    this.getDeviceStatus();
    this.infoDetails = [
      { name: 'Blood Pressure Module', status: false },
      { name: 'Cholesterol Module', status: false },
      { name: 'Glucometer', status: false },
      { name: 'ECG Module', status: false },
      { name: 'Hemoglobin Module', status: false },
      { name: 'Pluse Oximeter Module', status: false },
      { name: 'urtCam1Intro', status: false },
      { name: 'bgbenecheck', status: false },
      {
        name: 'Temperature',
        pairAPI: '/api/v1/physical_tests/temperature/pair',
        pairStatus: 'NP',
      },
      {
        name: 'Weight',
        pairAPI: '/api/v1/physical_tests/weight/pair',
        pairStatus: 'NP',
      },
    ];
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
  }

  //pair status    NP not paired, P - Pairing  PC - Pairing Completed   R for retry

  getDeviceStatus() {
    this.spinner = true;
    this.service.getDeviceStatus().subscribe(
      (res: any) => {
        const body = JSON.parse(res['_body']);
        if (body['deviceConnected']) {
          this.configureDevice(body);

          this.errMsg = undefined;
        } else {
          this.errMsg = undefined;
          this.deviceConnected = false;
          this.apiAvailable = true;
        }
        this.spinner = false;
      },
      err => {
        if (typeof err['_body'] !== 'object') {
          this.errMsg = undefined;
          this.deviceConnected = false;
          this.apiAvailable = true;
        } else {
          this.errMsg = 'IOT Device is not running';
          this.apiAvailable = false;
        }
        this.spinner = false;
      }
    );
  }

  getBluetoothDevice() {
    this.spinner = true;
    this.service.getBluetoothDevice().subscribe(
      (res: any) => {
        this.bluetoothDevices = JSON.parse(res['_body']);
        this.spinner = false;
        this.errMsg = undefined;
      },
      err => {
        this.spinner = false;
      }
    );
  }

  connectBluetoothDevice(str: string) {
    this.spinner = true;
    this.service.connectBluetoothDevice(str).subscribe(
      (res: any) => {
        const body = JSON.parse(res['_body']);
        this.configureDevice(body);
        this.spinner = false;
        this.errMsg = undefined;
      },
      err => {
        this.spinner = false;
      }
    );
  }
  //SH20094090,calibration integration,09-06-2021
  disconnectBluetoothDevice() {
    this.spinner = true;
    this.service.disconnectBluetoothDevice().subscribe(
      (res: any) => {
        if (res.status === 202 || res.status === 200) {
          this.service.setBluetoothConnected(false);
          this.deviceConnected = false;
          this.spinner = false;
          this.errMsg = undefined;
          console.log('disconnect log', JSON.parse(res['_body']));
          const body = JSON.parse(res['_body']);
          console.log(
            'disconnect log device connected',
            body['deviceConnected']
          );
        } else {
          this.errMsg = res['message'];
        }
      },
      err => {
        this.spinner = false;
        this.confirmationService.alert(
          'Unable to connect to bluetooth device',
          'error'
        );
      }
    );
  }
  configureDevice(body: any) {
    this.service.setBluetoothConnected(true);
    this.deviceConnected = true;
    this.apiAvailable = true;
    this.errMsg = undefined;
    this.infoDetails[0].status = body['bloodPressureIntro'];
    this.infoDetails[1].status = body['cholUaIntro'];
    this.infoDetails[2].status = body['glucometerIntro'];
    this.infoDetails[3].status = body['ecgIntro'];
    this.infoDetails[4].status = body['hbIntro'];
    this.infoDetails[5].status = body['pulseOxIntro'];
    this.infoDetails[6].status = body['urtCam1Intro'];
    this.infoDetails[7].status = body['bgbenecheck'];
  }

  pairDevice(url: any) {
    url.pairStatus = 'P';
    this.service.pairExternalDevice(url.pairAPI).subscribe(
      res => {
        url.pairStatus = 'PC';
      },
      err => {
        url.pairStatus = 'R';
      }
    );
  }
}

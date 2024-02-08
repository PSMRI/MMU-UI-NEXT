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

import { Component, Input } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  ResolveStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from '@angular/router';
import { SpinnerService } from './app-modules/core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isAuthenticated: boolean = false;
  constructor(
    private router: Router,
    private spinnerService: SpinnerService
  ) {}
  @Input()
  showRoles = false;

  OnInit() {
    const isAuth: any = sessionStorage.getItem('isAuthenticated');
    this.isAuthenticated = isAuth;
    this.router.events.subscribe(event => {
      if (
        event instanceof ResolveStart ||
        event instanceof RouteConfigLoadStart
      ) {
        this.spinnerService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof RouteConfigLoadEnd
      ) {
        setTimeout(() => this.spinnerService.hide(), 500);
      } else if (event instanceof NavigationError) {
        setTimeout(() => this.spinnerService.hide(), 500);
      } else if (event instanceof NavigationCancel) {
        setTimeout(() => this.spinnerService.hide(), 500);
      }
    });
  }
}

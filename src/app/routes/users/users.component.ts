import {Component, OnDestroy, OnInit} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular'; // Angular Data Grid Component
import type {ColDef} from 'ag-grid-community';
import {CompanyAndRolesComponent} from '../ag-grid/company-and-roles/company-and-roles.component';
import {HttpService} from '../../service/HttpService';
import {User} from '../../model/User';
import {Observable, Subject} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {UserActionsComponent} from '../ag-grid/user-actions/user-actions.component';
import {MatFormField} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Company} from '../../model/Company';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AgGridAngular, AsyncPipe, MatFormField, MatSelect, ReactiveFormsModule, MatOption],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit, OnDestroy {
  users$: Observable<User[]>;
  companies$: Observable<Company[]>;

  companiesCtrl = new FormControl('');
  destroy$ = new Subject<void>();

  constructor(private readonly httpService: HttpService) {
  }

  ngOnInit(): void {
    this.users$ = this.httpService.getUsers();
    this.companies$ = this.httpService.getCompanies();
  }

  defaultColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true, // small filter box under headers
    resizable: true
  };

  colDefs: ColDef[] = [
    {headerName: 'Id', field: 'id'},
    {headerName: 'User', valueGetter: (params: any) => `${params.data.firstname} ${params.data.lastname}`},
    {headerName: 'Email', field: 'email'},
    {
      headerName: 'Companies & Roles',
      cellRenderer: CompanyAndRolesComponent,
      filter: 'agTextColumnFilter',
      autoHeight: true
    },
    {
      headerName: 'Actions', cellRenderer: UserActionsComponent,
      cellRendererParams: (params: any) => ({
        allCompanies: this.companies$
      }),
      filter: false
    }
  ];

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

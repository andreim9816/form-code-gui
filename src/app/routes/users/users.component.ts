import {Component, OnDestroy, OnInit} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular'; // Angular Data Grid Component
import type {ColDef} from 'ag-grid-community';
import {UserType} from '../../model/UserType';
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

  company1 = {
    id: 1,
    name: 'ANAF',
    companyRoles: [{id: 1, name: 'Inspector 1', companyId: 1}, {id: 2, name: 'Inspector 2', companyId: 1}]
  };
  company2 = {
    id: 2,
    name: 'Primaria Roman',
    companyRoles: [{id: 3, name: 'Inspector Roman 1', companyId: 2}, {id: 4, name: 'Inspector Roman 2', companyId: 2}]
  };

  colDefs: ColDef[] = [
    {headerName: 'User', valueGetter: (params: any) => `${params.data.firstname} ${params.data.lastname}`},
    {headerName: 'Email', field: 'email'},
    {headerName: 'Companies & Roles', cellRenderer: CompanyAndRolesComponent, autoHeight: true},
    {headerName: 'Actions', cellRenderer: UserActionsComponent}
  ];

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  rowData = [
    {
      username: 'andreim98',
      firstname: 'Andrei',
      lastname: 'Manolache',
      email: 'andreim98@yahoo.com',
      phoneNumber: '0741130693',
      userTypes: [UserType.ADMIN, UserType.USER],
      companies: [this.company1, this.company2],
      companyRoles: [
        {id: 1, name: 'Inspector 1', companyId: 1},
        {id: 2, name: 'Inspector 2', companyId: 1},
        {id: 3, name: 'Inspector Roman 1', companyId: 2}
      ]
    },
    {
      username: 'diana2003',
      firstname: 'Diana',
      lastname: 'Manolache',
      email: 'diana2003@yahoo.com',
      phoneNumber: '0757175915',
      userTypes: [UserType.USER],
      companies: [this.company2],
      companyRoles: [{id: 4, name: 'Inspector Roman 2', companyId: 2}]
    },
    {
      username: 'laura2317',
      firstname: 'Laura',
      lastname: 'Cozma',
      email: 'cozmalaura23@yahoo.com',
      phoneNumber: '0727874060',
      userTypes: [UserType.USER]
    }
  ];
}

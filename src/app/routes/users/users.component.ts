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
    {headerName: 'Id', field: 'id', width: 60},
    {headerName: 'User', valueGetter: (params: any) => `${params.data.firstname} ${params.data.lastname}`},
    {headerName: 'Email', field: 'email'},
    {
      headerName: 'Companies & Roles',
      cellRenderer: CompanyAndRolesComponent,
      cellRendererParams: (params: any) => ({
        rolesPerCompany: this.mapCompaniesToRoles(params.data.companies, params.data.companyRoles)
      }),
      valueGetter: (params) => {
        const rolesPerCompany = this.mapCompaniesToRoles(params.data.companies, params.data.companyRoles)
        const x = (rolesPerCompany ?? [])
          .map((company: any) => `${company.name}: ${company.roles.map((r: any) => r.name).join(' ')}`)
        // console.log(x);
        return x;
      },
      filter: 'agTextColumnFilter',
      autoHeight: true
    },
    {
      headerName: 'Actions', cellRenderer: UserActionsComponent,
      cellRendererParams: (params: any) => ({
        rolesPerCompany: this.mapCompaniesToRoles(params.data.companies, params.data.companyRoles)
      }),
      filter: false,
      width: 60
    }
  ];

  mapCompaniesToRoles(companies: any[], companyRoles: any[]): any[] {
    const groupedRoles = (companyRoles ?? []).reduce((acc, role) => {
      if (!acc[role.companyId]) {
        acc[role.companyId] = [];
      }
      acc[role.companyId].push(role);
      return acc;
    }, {} as Record<number, any[]>);

    return (companies ?? [])
      .filter(company => groupedRoles[company.id])
      .map(company => ({
        id: company.id,
        name: company.name,
        roles: groupedRoles[company.id] || []
      }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

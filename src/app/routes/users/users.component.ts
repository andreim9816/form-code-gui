import {Component, OnDestroy, OnInit} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular'; // Angular Data Grid Component
import type {ColDef} from 'ag-grid-community';
import {CompanyAndRolesComponent} from '../ag-grid/company-and-roles/company-and-roles.component';
import {HttpService} from '../../service/HttpService';
import {User} from '../../model/User';
import {Observable, Subject} from 'rxjs';
import {UserActionsComponent} from '../ag-grid/user-actions/user-actions.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Company} from '../../model/Company';
import {CompanyRole} from '../../model/CompanyRole';
import {MatButton} from '@angular/material/button';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AgGridAngular, ReactiveFormsModule, MatButton, AsyncPipe],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit, OnDestroy {
  paginationPageSize = 20;
  paginationPageSizeSelector: number[] | boolean = [10, 20, 50];

  gridOptions = {
    rowStyle: {
      'display': 'flex ',
      'justify-content': 'center',
      'align-items': 'center ',
    },
  }

  users$: Observable<User[]>;
  companies$: Observable<Company[]>;

  companiesCtrl = new FormControl('');
  destroy$ = new Subject<void>();

  constructor(private readonly httpService: HttpService) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
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
    {
      headerName: 'User',
      valueGetter: (params: any) => `${params.data.firstname} ${params.data.lastname}`,
      flex: 3
    },

    {headerName: 'Email', field: 'email', flex: 3},
    {
      headerName: 'Companies & Roles',
      cellRenderer: CompanyAndRolesComponent,
      cellRendererParams: (params: any) => ({
        rolesPerCompany: this.mapCompaniesToRoles(params.data.companyRoles)
      }),
      valueGetter: (params) => {
        const rolesPerCompany = this.mapCompaniesToRoles(params.data.companyRoles)
        return (rolesPerCompany ?? [])
          .map((company: any) => `${company.name}: ${company.roles.map((r: any) => r.name).join(' ')}`);
      },
      flex: 5,
      filter: 'agTextColumnFilter',
      autoHeight: true
    },
    {
      headerName: 'Actions', cellRenderer: UserActionsComponent,
      cellRendererParams: (params: any) => ({
        allCompanies$: this.httpService.getCompanies(),
        rolesPerCompany: this.mapCompaniesToRoles(params.data.companyRoles),
        onRefresh: () => this.refreshData()
      }),
      filter: false,
      width: 140
    }
  ];

  mapCompaniesToRoles(companyRoles: any[]): RolesPerCompany[] {
    const groupedRoles = (companyRoles ?? []).reduce((acc, role) => {
      if (!acc[role.companyId]) {
        acc[role.companyId] = [];
      }
      acc[role.companyId].push(role);
      return acc;
    }, {} as Record<number, any[]>);

    const result: RolesPerCompany[] = [];

    for (const [companyId, roles] of Object.entries(groupedRoles)) {
      result.push({
        id: Number(companyId),
        name: (roles as CompanyRole[])[0].companyName,
        roles: roles
      } as RolesPerCompany);
    }
    return result;
  }

  refreshData(): void {
    this.fetchData();
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

export interface RolesPerCompany {
  id: number;
  name: string;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
}

import {Component, OnInit} from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {Company} from '../../model/Company';
import {HttpService} from '../../service/HttpService';
import type {ColDef} from 'ag-grid-community';
import {CompanyAdminsComponent} from '../ag-grid/company-admins/company-admins.component';
import {CompanyRolesComponent} from '../ag-grid/company-roles/company-roles.component';
import {MatDialog} from '@angular/material/dialog';
import {CreateCompanyComponent} from './create-company/create-company.component';
import {MatButton} from '@angular/material/button';
import {EditBtnComponent} from '../../shared/edit-btn/edit-btn.component';
import {User} from '../../model/User';
import {CompanyRole} from '../../model/CompanyRole';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [
    AgGridAngular,
    MatButton
  ],
  templateUrl: './companies.component.html'
})
export class CompaniesComponent implements OnInit {
  companies: Company[];
  paginationPageSize = 20;
  paginationPageSizeSelector: number[] | boolean = [10, 20, 50];

  gridOptions = {
    rowStyle: {
      'display': 'flex ',
      'justify-content': 'center',
      'align-items': 'center ',
      'height': '47px'
    },
  };

  defaultColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true, // small filter box under headers
    resizable: true
  };

  colDefs: ColDef[] = [
    {headerName: 'Company', field: 'name', width: 75},
    {
      headerName: 'Admins',
      cellRenderer: CompanyAdminsComponent,
      valueGetter: (params) => {
        const adminUsers = params.data.adminUsers ?? [];
        return adminUsers.map((user: User) => `${user.lastname} ${user.firstname}`).join(', ');
      }
    },
    {
      headerName: 'Roles',
      cellRenderer: CompanyRolesComponent,
      valueGetter: (params) => {
        const companyRoles = params.data.companyRoles ?? [];
        return companyRoles.map((companyRole: CompanyRole) => companyRole.name).join(', ');
      }
    },
    {
      headerName: 'Action',
      cellRenderer: EditBtnComponent,
      onCellClicked: (params) => {
        this.openAddEditCompanyModal(params.data);
      },
      filter: false,
      width: 53
    }];

  constructor(
    private readonly httpService: HttpService,
    private readonly dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.httpService.getCompanies()
      .subscribe(companies => {
        this.companies = companies
      });
  }

  openAddEditCompanyModal(company: Company | undefined): void {
    const dialogRef = this.dialog.open(CreateCompanyComponent, {
      data: {
        company
      },
      width: '800px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchData();
      }
    });
  }
}

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
  }

  colDefs: ColDef[] = [
    {headerName: 'Company', field: 'name', width: 75},
    {headerName: 'Admins', cellRenderer: CompanyAdminsComponent},
    {headerName: 'Roles', cellRenderer: CompanyRolesComponent},
    {
      headerName: 'Action',
      cellRenderer: EditBtnComponent,
      onCellClicked: (params) => {
        this.openAddEditCompanyModal(params.data);
      },
      width: 53
    }
  ];

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

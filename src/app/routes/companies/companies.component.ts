import {Component, OnInit} from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {Company} from '../../model/Company';
import {HttpService} from '../../service/HttpService';
import type {ColDef} from 'ag-grid-community';
import {CompanyAdminsComponent} from '../ag-grid/company-admins/company-admins.component';
import {CompanyRolesComponent} from '../ag-grid/company-roles/company-roles.component';
import {MatDialog} from '@angular/material/dialog';
import {CreateCompanyComponent} from './create-company/create-company.component';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [
    AgGridAngular
  ],
  templateUrl: './companies.component.html'
})
export class CompaniesComponent implements OnInit {
  companies: Company[];
  paginationPageSize = 10;
  paginationPageSizeSelector: number[] | boolean = [10, 20, 50];

  colDefs: ColDef[] = [
    {headerName: 'Company', field: 'name'},
    {headerName: 'Admins', cellRenderer: CompanyAdminsComponent},
    {headerName: 'Roles', cellRenderer: CompanyRolesComponent, autoHeight: true},
    //todo add edit button
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

  addNewCompany(): void {
    const dialogRef = this.dialog.open(CreateCompanyComponent, {
      width: '600px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchData();
    });
  }
}

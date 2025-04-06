import {Component, OnInit} from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {Observable} from 'rxjs';
import {Company} from '../../model/Company';
import {HttpService} from '../../service/HttpService';
import {AsyncPipe} from '@angular/common';
import type {ColDef} from 'ag-grid-community';
import {CompanyAdminsComponent} from '../ag-grid/company-admins/company-admins.component';
import {CompanyRolesComponent} from '../ag-grid/company-roles/company-roles.component';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [
    AgGridAngular,
    AsyncPipe
  ],
  templateUrl: './companies.component.html'
})
export class CompaniesComponent implements OnInit {
  companies$: Observable<Company[]>;
  paginationPageSize = 10;
  paginationPageSizeSelector: number[] | boolean = [10, 20, 50];

  colDefs: ColDef[] = [
    {headerName: 'Id', field: 'id'},
    {headerName: 'Company', field: 'name'},
    {headerName: 'Admins', cellRenderer: CompanyAdminsComponent},
    {headerName: 'Roles', cellRenderer: CompanyRolesComponent},
  ];

  constructor(private readonly httpService: HttpService) {
  }

  ngOnInit(): void {
    this.companies$ = this.httpService.getCompanies()
  }
}

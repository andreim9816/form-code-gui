import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../../model/User';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel, MatOption, MatSelect} from '@angular/material/select';
import {Company} from '../../../model/Company';
import {HttpService} from '../../../service/HttpService';
import {MatDivider} from '@angular/material/divider';
import {Role, RolesPerCompany} from '../users.component';

@Component({
  selector: 'app-user-edit-roles',
  imports: [CommonModule, MatDialogActions, MatButton, FormsModule, MatSelect, MatOption, MatDivider, MatLabel, MatFormField],
  standalone: true,
  templateUrl: './user-edit-roles.component.html'
})
export class UserEditRolesComponent implements OnInit {
  user: User;
  rolesPerCompany: RolesPerCompany[];
  allCompanies: Company[];

  isNewCompany = false;

  constructor(
    private readonly httpService: HttpService,
    public dialogRef: MatDialogRef<UserEditRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.user = data.user;
    //deep copy because if I close the dialog, then I don't want the changes to affect the original object
    this.rolesPerCompany = structuredClone(data.rolesPerCompany);
    this.allCompanies = data.allCompanies;
  }

  ngOnInit() {
  }

  submit(): void {
    const companyRoleIds = this.rolesPerCompany.flatMap(company => company.roles.flatMap(role => role.id));
    this.httpService.saveCompanyRolesForUser(this.user.id, companyRoleIds).subscribe(result => {
      this.dialogRef.close(result);
    });
  }

  getAllRolesForCompany(companyId: number) {
    return this.allCompanies.find(x => x.id === companyId)?.companyRoles ?? [];
  }

  getCompaniesWithoutRoleForUser(): Company[] {
    const companyIdsOfUser = this.rolesPerCompany.map((c) => c.id);
    return this.allCompanies.filter((company: Company) => {
      return !companyIdsOfUser.includes(company.id);
    })
  }

  addNewCompanyForRoles(): void {
    this.isNewCompany = true;
  }

  selectNewCompany(company: Company): void {
    this.isNewCompany = false;
    const newCompany = {
      id: company.id,
      name: company.name,
      roles: []
    } as any;
    this.rolesPerCompany.push(newCompany);
  }

  deleteCurrentCompany(companyId: number): void {
    const companyIdx = this.rolesPerCompany.findIndex(x => x.id === companyId);
    this.rolesPerCompany.splice(companyIdx, 1);
  }

  compareWithRole = (c1: Role, c2: Role) => c1 && c2 && c1.id === c2.id;

  close(): void {
    this.dialogRef.close();
  }
}

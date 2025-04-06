import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../../model/User';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {Company} from '../../../model/Company';
import {HttpService} from '../../../service/HttpService';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-user-edit-roles',
  imports: [CommonModule, MatDialogActions, MatButton, FormsModule, MatSelect, MatOption],
  standalone: true,
  templateUrl: './user-edit-roles.component.html'
})
export class UserEditRolesComponent implements OnInit {
  user: User;
  rolesPerCompany: any[];
  allCompanies$: Observable<Company[]>;

  constructor(
    private readonly httpService: HttpService,
    public dialogRef: MatDialogRef<UserEditRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.user = data.user;
    this.rolesPerCompany = data.rolesPerCompany;

    console.log(this.user);
    console.log(this.rolesPerCompany);
  }

  ngOnInit() {
    this.allCompanies$ = this.httpService.getCompanies();
  }

  submit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

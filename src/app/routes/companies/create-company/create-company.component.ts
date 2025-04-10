import {Component, Inject, OnDestroy, ViewChild} from '@angular/core';
import {HttpService} from '../../../service/HttpService';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatCheckbox} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-create-company',
  imports: [
    CommonModule, MatFormField, MatInput, MatLabel, MatDialogTitle,
    MatDialogContent, MatButton, MatDialogActions, MatDivider,
    MatTable, MatHeaderRow, MatRow, MatColumnDef,
    MatHeaderCell, MatCell, MatCheckbox, FormsModule, MatCellDef, MatHeaderCellDef, MatHeaderRowDef, MatRowDef
  ],
  templateUrl: './create-company.component.html'
})
export class CreateCompanyComponent implements OnDestroy {
  destroy$ = new Subject<void>();
  companyName: string;

  @ViewChild(MatTable)
  table: MatTable<RoleRow>;

  displayedColumns: string[] = ['name', 'create_template', 'delete'];
  roles: RoleRow[] = [];

  constructor(
    private readonly httpService: HttpService,
    public dialogRef: MatDialogRef<CreateCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  addRole(): void {
    this.roles.push({name: '', create_template: false} as RoleRow);
    this.table?.renderRows();
  }

  deleteRole(row: RoleRow): void {
    const idx = this.roles.findIndex(v => v.name === row.name);
    this.roles.splice(idx, 1);
    this.table?.renderRows();
  }

  onToggleCanCreate(row: RoleRow) {
    row.create_template = !row.create_template;
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    const body = {
      name: this.companyName,
      companyRoles: this.roles
    };
    this.httpService.createCompany(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe(company => {
        this.dialogRef.close(company);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

interface RoleRow {
  name: string;
  create_template: boolean;
}

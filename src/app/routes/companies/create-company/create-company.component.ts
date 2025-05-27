import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '../../../service/HttpService';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {Subject, takeUntil} from 'rxjs';
import {User} from '../../../model/User';
import {Company} from '../../../model/Company';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatDivider} from '@angular/material/divider';
import {MatInput} from '@angular/material/input';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatOption, MatSelect, MatSelectTrigger} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {NotificationService} from '../../../service/notification-service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-create-company',
  imports: [
    CommonModule,
    MatTable,
    MatCell,
    MatHeaderCell,
    MatLabel,
    MatSelectTrigger,
    MatColumnDef,
    MatFormField,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatDivider,
    MatDialogContent,
    MatInput,
    FormsModule,
    MatCheckbox,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
    MatHeaderRow,
    MatRow,
    ReactiveFormsModule,
    FormsModule,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef
  ],
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css']
})
export class CreateCompanyComponent implements OnInit, OnDestroy {
  company: Company;

  allUsers: User[];

  @ViewChild(MatTable)
  table: MatTable<RoleRow>;

  formGroup: FormGroup;

  displayedColumns: string[] = ['name', 'createTemplate', 'validateForm', 'delete'];
  roles: RoleRow[] = [];

  destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly httpService: HttpService,
    private readonly notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreateCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.company) {
      this.company = data.company;
      this.roles = this.company.companyRoles.map(x => (
        {
          companyRoleId: x.id,
          name: x.name,
          createTemplate: x.createTemplate,
          validateForm: x.validateForm
        }))
    } else {
      this.company = {
        id: undefined,
        name: '',
        companyRoles: [],
        adminUsers: []
      } as Company;
    }
  }

  ngOnInit(): void {
    this.createFormGroup();
    this.getAllUsers();
  }

  createFormGroup(): void {
    this.formGroup = this.fb.group({
      nameCtrl: [this.company.name, Validators.required]
    });
  }

  getAllUsers(): void {
    this.httpService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(allUsers => {
        this.allUsers = allUsers;
      });
  }

  addRole(): void {
    this.roles.push({companyRoleId: undefined, name: '', createTemplate: false, validateForm: false} as RoleRow);
    this.table?.renderRows();
  }

  deleteRole(row: RoleRow): void {
    const idx = this.roles.findIndex(v => v.name === row.name);
    this.roles.splice(idx, 1);
    this.table?.renderRows();
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    const body = {
      name: this.formGroup.controls['nameCtrl'].value,
      companyRoles: this.roles,
      adminUserIds: this.company.adminUsers.map(x => x.id)
    };

    if (!this.formGroup.valid) {
      return;
    }

    if (this.company.id) {
      this.httpService.updateCompany(this.company.id, body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (company) => {
            this.dialogRef.close(company);
          },
          error: (err: HttpErrorResponse) => {
            const errorMessage = err.error.message;
            this.notificationService.displayNotificationError(errorMessage);
          }
        });
    } else {
      this.httpService.createCompany(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (company) => {
            this.dialogRef.close(company);
          },
          error: (err: HttpErrorResponse) => {
            const errorMessage = err.error.message;
            this.notificationService.displayNotificationError(errorMessage);
          }
        });
    }
  }

  compareWithUser = (c1: User, c2: User) => c1 && c2 && c1.id === c2.id;

  isEdit(): boolean {
    return this.company.id != null;
  }

  displayTitle(): string {
    if (this.isEdit()) {
      return 'Edit company';
    } else {
      return 'Add company';
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

interface RoleRow {
  companyRoleId: number | undefined;
  name: string;
  createTemplate: boolean;
  validateForm: boolean;
}

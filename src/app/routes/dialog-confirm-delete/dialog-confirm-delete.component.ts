import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {SectionField} from '../../model/SectionField';
import {ContentType} from '../../model/ContentType';

@Component({
  selector: 'app-dialog-confirm-delete',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
  ],
  templateUrl: './dialog-confirm-delete.component.html'
})
export class DialogConfirmDeleteComponent implements OnInit {
  constructor(
    private readonly dialogRef: MatDialogRef<DialogConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: SectionField) {
  }

  ngOnInit() {
    console.log(this.data);
  }

  closeDialog(confirm: boolean): void {
    this.dialogRef.close(confirm);
  }

  getContent() {
    return this.data.defaultValue;
  }

  readonly ContentType = ContentType;
}

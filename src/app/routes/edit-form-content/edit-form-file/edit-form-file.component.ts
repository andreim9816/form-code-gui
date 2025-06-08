import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {FormSectionField} from '../../../model/FormSectionField';
import {HttpService} from '../../../service/HttpService';

@Component({
  selector: 'app-edit-form-file',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './edit-form-file.component.html'
})
export class EditFormFileComponent {
  @Input()
  formSectionField: FormSectionField;
  @Input()
  fieldControl!: any;
  @Output()
  newFileContent = new EventEmitter<{
    file: File | null,
    contentFileId: number
  }>();

  selectedFile: File | null;

  constructor(private readonly httpService: HttpService) {
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.newFileContent.emit({
      file: this.selectedFile,
      contentFileId: this.formSectionField.contentFile.id
    });

    // if (this.selectedFile) {
    //   this.uploadFile(this.formSectionField.contentFile.id, this.selectedFile); //this should be triggered only when clicking on the submit button
    // }
  }

  downloadFile() {
    if (this.selectedFile) {
      this.downloadFileFromLocalFile();
    } else {
      this.downloadFileFromServer();
    }
  }

  downloadFileFromServer() {
    this.httpService
      .downloadFile(this.formSectionField.contentFile.id)
      .subscribe(response => {
        const contentDisposition = response.headers.get('content-disposition');
        const matches = /filename="([^"]+)"/.exec(contentDisposition || '');
        const filename = matches?.[1] || 'file';

        const blob = response.body!;
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  downloadFileFromLocalFile() {
    const url = URL.createObjectURL(this.selectedFile!);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.selectedFile!.name; // optional: customize filename
    a.click();
    URL.revokeObjectURL(url); // clean up
  }

  getDisplayFileName() {
    if (this.selectedFile) {
      return this.selectedFile.name;
    }
    return this.formSectionField.contentFile.name; //should not be an issue
  }
}

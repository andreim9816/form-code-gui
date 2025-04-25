import {Component, Input} from '@angular/core';
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

  selectedFile: File | null;

  constructor(private readonly httpService: HttpService) {
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
    if (this.selectedFile) {
      this.uploadFile(); //this should be triggered only when clicking on the submit button
    }
  }

  uploadFile(): void {
    const formData = new FormData();
    formData.append(`dtos[0].id`, this.formSectionField.contentFile.id.toString());
    formData.append(`dtos[0].content`, this.selectedFile!);

    this.httpService.uploadFiles(formData).subscribe();
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
        console.log(contentDisposition);
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

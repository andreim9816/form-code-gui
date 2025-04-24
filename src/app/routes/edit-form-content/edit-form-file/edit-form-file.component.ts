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

  selectedFile!: File;

  constructor(private readonly httpService: HttpService) {
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
    this.uploadFile(); //this should be triggered only when clicking on the submit button
  }

  uploadFile(): void {
    const formData = new FormData();
    formData.append(`dtos[0].id`, this.formSectionField.contentFile.id.toString());
    formData.append(`dtos[0].content`, this.selectedFile);

    this.httpService.uploadFiles(formData).subscribe();
  }

  downloadFile() {
    this.httpService.downloadFile(this.formSectionField.contentFile.id).subscribe();
  }
}

import {Component, Input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SectionField} from '../../model/SectionField';

@Component({
  selector: 'app-file',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './file.component.html'
})
export class FileComponent {
  @Input()
  sectionField: SectionField;

  selectedFile!: File;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}

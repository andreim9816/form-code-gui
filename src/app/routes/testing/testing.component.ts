import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-testing',
  imports: [CommonModule, MatCardContent, MatCardTitle, MatCard, ReactiveFormsModule],
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css'
})
export class TestingComponent {
  selectedFile!: File;
  uploadMessage: string = '';

  constructor(private http: HttpClient) {
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8080/api/files/upload', formData)
      .subscribe({
        next: (response: any) => {
          this.uploadMessage = 'File uploaded successfully!';
        },
        error: (error) => {
          this.uploadMessage = 'Upload failed.';
          console.error(error);
        }
      });
  }
}

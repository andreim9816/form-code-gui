import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [
    MatButton
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  selectedFile: File;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}

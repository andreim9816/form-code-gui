import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-register',
    imports: [
        MatButton,
        RouterLink
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    selectedFile: File;

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }
}

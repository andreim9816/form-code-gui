import { Component } from '@angular/core';
import {MatAnchor} from "@angular/material/button";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-navbar',
    imports: [
        MatAnchor,
        MatToolbar,
        MatToolbarRow,
        NgIf,
        RouterLink,
        RouterLinkActive
    ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}

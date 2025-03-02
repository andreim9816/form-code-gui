import {Component} from '@angular/core';

@Component({
  selector: 'app-testing',
  imports: [],
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css'
})
export class TestingComponent {
  list1: any[] = [];
  list2: any[] = [];

  newElem1(): void {
    this.list1.push("abc");
  }

  newElem2(): void {
    this.list2.push("def");
  }
}

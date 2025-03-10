import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-testing',
  imports: [CommonModule],
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css'
})
export class TestingComponent implements OnInit {

  ngOnInit(): void {
    document.addEventListener('click', (event) => this.onClickOutside(event));
  }

  @ViewChild('contextMenu') contextMenu!: ElementRef;
  contextMenuStyles = {display: 'none', top: '0px', left: '0px'};

  openContextMenu(event: MouseEvent, input: HTMLInputElement) {
    event.preventDefault(); // Prevent the default right-click menu

    // Position the menu at the mouse cursor
    this.contextMenuStyles = {
      display: 'block',
      top: `${event.clientY}px`,
      left: `${event.clientX}px`,
    };
  }

  onDelete() {
    console.log('Delete clicked');
    alert('Delete action triggered');
    this.closeContextMenu();
  }

  onEdit() {
    console.log('Edit clicked');
    alert('Edit action triggered');
    this.closeContextMenu();
  }

  closeContextMenu() {
    this.contextMenuStyles = {display: 'none', top: '0px', left: '0px'};
  }

  // Close menu when clicking outside
  onClickOutside(event: Event) {
    if (!this.contextMenu.nativeElement.contains(event.target)) {
      this.closeContextMenu();
    }
  }
}

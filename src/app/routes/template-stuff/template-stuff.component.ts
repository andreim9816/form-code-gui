import {Component, Renderer2} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-template-stuff',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './template-stuff.component.html',
  styleUrl: './template-stuff.component.css'
})
export class TemplateStuffComponent {
  cursorPosition: number = 0;

  constructor(private renderer: Renderer2) {
  }

  setCursorPosition(event: MouseEvent) {
    const target = event.target as HTMLInputElement;
    this.cursorPosition = target.selectionStart as number;
  }

  addCheckbox() {
    const inputElement = document.getElementById('textInput') as HTMLInputElement;
    const inputValue = inputElement.value;
    const beforeText = inputValue.substring(0, this.cursorPosition);
    const afterText = inputValue.substring(this.cursorPosition);

    // Clear the existing input element
    inputElement.value = '';

    // Create the new elements
    const firstInput = this.renderer.createElement('input');
    this.renderer.setAttribute(firstInput, 'type', 'text');
    this.renderer.setAttribute(firstInput, 'value', beforeText);
    this.renderer.addClass(firstInput, 'form-control');

    const checkbox = this.renderer.createElement('input');
    this.renderer.setAttribute(checkbox, 'type', 'checkbox');
    this.renderer.addClass(checkbox, 'mx-2');

    const secondInput = this.renderer.createElement('input');
    this.renderer.setAttribute(secondInput, 'type', 'text');
    this.renderer.setAttribute(secondInput, 'value', afterText);
    this.renderer.addClass(secondInput, 'form-control');

    // Insert the new elements into the DOM
    const container = inputElement.parentElement;
    this.renderer.removeChild(container, inputElement);
    this.renderer.appendChild(container, firstInput);
    this.renderer.appendChild(container, checkbox);
    this.renderer.appendChild(container, secondInput);
  }
}

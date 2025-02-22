import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[autoExpand]'
})
export class AutoExpandDirective {
  constructor(private el: ElementRef) {
  }

  @HostListener('input')
  onInput(): void {
    this.adjustWidth();
  }

  @HostListener('click')
  onClick(): void {
    this.adjustWidth();
  }

  @HostListener('keydown')
  onKeydown(): void {
    this.adjustWidth();
  }

  private adjustWidth(): void {
    const textarea: HTMLTextAreaElement = this.el.nativeElement;
    textarea.style.width = 'auto'; // Temporarily set width to auto
    textarea.style.width = `${textarea.scrollWidth}px`; // Set width based on scrollWidth
  }
}

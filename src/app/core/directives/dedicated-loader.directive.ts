import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDedicatedLoader]',
})
export class DedicatedLoaderDirective {
  private readonly loaderClass = 'directive-loader'; // defined in styles.scss

  @Input() set loaderStatus(value: boolean) {
    if (this.el.nativeElement) {
      if (value) {
        this.el.nativeElement.classList.add(this.loaderClass);
      } else {
        this.el.nativeElement.classList.remove(this.loaderClass);
      }
    }
  }

  constructor(private el: ElementRef<HTMLElement>) {}
}

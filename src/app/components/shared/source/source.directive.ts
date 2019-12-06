import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import Popper from 'popper.js';
import { SourceTooltipComponent } from './source-tooltip.component';

@Directive({
  selector: '[utmSource]',
})
export class SourceDirective implements OnInit, OnDestroy {
  @Input('utmSource') sourceUrl: string;
  tooltipRef: ComponentRef<SourceTooltipComponent>;
  tooltipPopper: Popper;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private vc: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  private createTooltipElem() {
    // Create tooltip based on tooltip component
    const tooltipFactory: ComponentFactory<
      SourceTooltipComponent
    > = this.componentFactoryResolver.resolveComponentFactory(
      SourceTooltipComponent
    );
    this.tooltipRef = this.vc.createComponent(tooltipFactory);

    // Set the source for the tooltip
    this.tooltipRef.instance.source = this.sourceUrl;

    // Hide the tooltip
    this.setTooltipVisibility(false);
  }

  private underlineSource() {
    this.renderer.setStyle(
      this.elRef.nativeElement,
      'text-decoration-line',
      'underline'
    );
    this.renderer.setStyle(
      this.elRef.nativeElement,
      'text-decoration-style',
      'dashed'
    ); // solid, wavy, dotted, dashed, double
    this.renderer.setStyle(
      this.elRef.nativeElement,
      'text-decoration-color',
      '#157dbf'
    );
    this.renderer.setStyle(this.elRef.nativeElement, 'font-style', 'italic');
    this.renderer.setStyle(this.elRef.nativeElement, 'cursor', 'pointer');
  }

  private setTooltipVisibility(visible: boolean) {
    this.renderer.setStyle(
      this.tooltipRef.location.nativeElement,
      'display',
      visible ? 'block' : 'none'
    );
  }

  @HostListener('mouseenter') onMouseEnter(event: Event) {}

  @HostListener('click') onClick(event: Event) {
    if (this.tooltipPopper === undefined) {
      // Use Popper to place the tooltip in the right place relative to the source element
      this.tooltipPopper = new Popper(
        this.elRef.nativeElement,
        this.tooltipRef.location.nativeElement,
        {
          placement: 'top',
        }
      );
    }

    // Show the tooltip
    this.setTooltipVisibility(true);
  }

  @HostListener('document:click', ['$event.target']) onClickDocument(target) {
    const clickedSource = this.elRef.nativeElement.contains(target);
    const clickedTooltip = this.tooltipRef.location.nativeElement.contains(
      target
    );

    if (!clickedSource && !clickedTooltip) {
      // Clicked outside both the source and the tooltip
      // Hide the tooltip
      this.setTooltipVisibility(false);
    }
  }

  ngOnInit() {
    this.createTooltipElem();
    this.underlineSource();
  }

  ngOnDestroy() {
    this.tooltipRef.destroy();
    this.tooltipPopper.destroy();
  }
}

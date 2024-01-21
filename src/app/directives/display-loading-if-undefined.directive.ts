import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { LoadingIndicatorComponent } from '../loading/loading-indicator/loading-indicator.component';

@Directive({
  selector: '[wpDisplayLoadingIfUndefined]'
})
export class DisplayLoadingIfUndefinedDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    ) { }

  @Input() set wea5DisplayLoadingIfUndefined(condition: any) {
    if (condition != undefined) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else { 
      this.viewContainer.clear();
      this.viewContainer.createComponent(LoadingIndicatorComponent);   
    }
  }

}

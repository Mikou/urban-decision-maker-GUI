import { 
    OnInit, 
    Component, 
    ComponentFactoryResolver,
    ComponentRef,
    ViewChild,
    ViewContainerRef,
    Input, 
    Output, 
    EventEmitter 
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MakeDraggable } from '../../shared/draggable/make-draggable.directive';
import {VisualizationComponent} from './visualization.component';
import { CommentFeatureComponent } from './featureComponents/comment.component';
import { CommentarchiveComponent } from './featureComponents/commentarchive.component';

@Component({
  selector: 'ud2d-widgetlistitem',
  template: `
    <div class="widgetlistitem-content" [makeDraggable]="item">
        <li>
            <p>{{item.name}} <button (click)="deleteWidget(item.id)">delete</button></p>
        </li>
        <div #target></div>
    </div>
  `
})

export class WidgetlistitemComponent {
    @Input() item: any;
    @Output() deleteWidgetNotify: EventEmitter<number> = new EventEmitter<number>();
    @ViewChild('target', {read: ViewContainerRef}) target:any;
    
    cmpRef: ComponentRef<any>

    constructor(
        private domSanitizer: DomSanitizer,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    ngOnInit() {
        let cptType:any;

        if(this.item.cptType === 'visualization') {
            cptType = VisualizationComponent;
        } else if(this.item.cptType === 'comment') {
            cptType = CommentFeatureComponent;
        } else if(this.item.cptType === 'commentarchive') {
            cptType = CommentarchiveComponent;
        }

        let factory = this.componentFactoryResolver.resolveComponentFactory(cptType);
        this.cmpRef = this.target.createComponent(factory)
        this.cmpRef.instance.config = this.item.visualization;
    }

    deleteWidget(widgetId:number) {
        this.deleteWidgetNotify.emit(widgetId);
    }
}
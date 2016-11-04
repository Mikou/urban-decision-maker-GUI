import { Component, ViewChild,ViewContainerRef, Compiler, ComponentFactoryResolver, ComponentRef, Input, OnInit } from '@angular/core';
import { CommentFeatureComponent } from './featureComponents/comment.component';
import { WidgetlistitemComponent } from './widgetlistitem.component';
import { ActivatedRoute } from '@angular/router';

import { WidgetService } from './widget.service';

@Component({
  selector: 'ud2d-widgetlist',
    styles: [`
    ud2d-widgetlistitem {
        float:left;
        padding:10px;
        margin:10px;
        border:1px solid #ccf;
    }
  `],
  template: `
    <h3>{{title}}</h3>
    <ud2d-widgetlistitem
      *ngFor="let widgetitem of widgetitems" 
      [item]="widgetitem"
      makeDroppable (dropped)="droppedWidget($event, widgetitem)"
      (deleteWidgetNotify)="onDelete($event)"
      #target>
    </ud2d-widgetlistitem>
  `
})

export class WidgetlistComponent implements OnInit {
  @Input() decisionspaceId:number;
  @ViewChild('target', {read: ViewContainerRef}) target:any;
  // DYNAMIC LOADING COMPONENT:
  //http://stackoverflow.com/questions/36325212/angular-2-dynamic-tabs-with-user-click-chosen-components/36325468#36325468
  title = 'widget list';
  cmpRef:ComponentRef<any>;
  widgetitems:any;
  constructor(
    private compiler: Compiler ,
    private componentFactoryResolver: ComponentFactoryResolver,
    private widgetService: WidgetService,
    private activatedRoute: ActivatedRoute
    ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.widgetService.getWidgetsSlowly(params["id"]).then(widgets => {
        console.log("widgets ready:", widgets);
        this.widgetitems = widgets;
        console.log("widgets ready:", this.widgetitems);
      })
    });
  }

  onDelete(widgetId:number):void {
    this.widgetitems.forEach((widget:any, index:any, object:any) => {
        if(widget.id == widgetId) object.splice(index,1);
    });
  }

  moveRow(src:number, trg:number) {
    if(src > trg) {
      for(let i = trg; i<src; i++)
        this.widgetitems[i].order++;
    } else {
      for (let i = src + 1; i <= trg; i++) {
        this.widgetitems[i].order--;
      }
    }
    this.widgetitems[src].order = trg;
    this.widgetitems.sort((a:any, b:any) => a.order - b.order);
  }

  deployVisualization(name:string, url:string) {
    let order = this.widgetitems.length;

    this.widgetitems.push({ id:this.widgetitems.length, type:'widget', cptType:'visualization', name:name, order:order,
      config: {
        url:url
      } });
  }

  deployFeature(src:any) {
    let order = this.widgetitems.length;
    this.widgetitems.push({ id:this.widgetitems.length, type:'widget', cptType:src.cptType, name:src.name, order:order,
      config: src.config
    });

  }

  droppedWidget(src: any, trg: any) {
    if(src.type === 'visItem') {
      this.deployVisualization(src.name, src.url);
    } else if(src.type === 'featureItem') {
      this.deployFeature(src);
    }
    else if(src.type === 'widget') {
      this.moveRow(src.order, trg.order);
    }
  };

  /*widgetitems = [
    {id:1, order:0, name:"widget1", type:"widget", cptType: 'visualization', 
    config: {
      url:"http://dummyvis.com/#1"}
    },
    {id:2, order:1, name:"widget2", type:"widget", cptType: 'visualization', 
    config: {
      url:"http://dummyvis.com/#2"}
    },
    {id:3, order:2, name:"widget3", type:"widget", cptType: 'visualization', 
    config: {
      url:"http://dummyvis.com/#3"}
    },
  ];*/
}
import { Component, OnInit, Input, Output , EventEmitter } from '@angular/core';
import { Data } from 'src/app/models/data';

@Component({
  selector: 'app-shapes',
  templateUrl: './shapes.component.html',
  styleUrls: ['./shapes.component.scss']
})
export class ShapesComponent implements OnInit {
  
  @Output() onShapeChange : EventEmitter<any> = new EventEmitter();

  showShapeArea: boolean;  
  data: any;  
  
  constructor() { }

  ngOnInit() {
    this.data = new Data();
    this.showShapeArea = true;
  }

  onChange(shape){
    this.onShapeChange.emit({shape: shape , });
  }

}

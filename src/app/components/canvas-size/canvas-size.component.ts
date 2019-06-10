import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Data } from 'src/app/models/data';

@Component({
  selector: 'app-canvas-size',
  templateUrl: './canvas-size.component.html',
  styleUrls: ['./canvas-size.component.scss']
})
export class CanvasSizeComponent implements OnInit {

  @Input() selectedOptions: any;
  @Output() onSizeChange : EventEmitter<any> = new EventEmitter();

  showSizeArea: boolean;  
  data: any;  
  
  constructor() { }

  ngOnInit() {
    this.data = new Data();
    this.showSizeArea = true;
  }

  onChange(size){
    this.onSizeChange.emit(size);
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Data } from 'src/app/models/data';
import { fabric } from 'fabric';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  @Input() data: Data;
  @Input() selectedOptions: any;
  @Input() selectedImage: string;
  @Input() canvas: any;  
  
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter<any>();

  showFilterArea: boolean;

  constructor() {}

  ngOnInit() {
    this.showFilterArea = true;
  }

  onChange(filter){
    this.onFilterChange.emit(filter);
  }

  applyFilter(filter){
    this.selectedOptions.filter = filter;
    const obj = this.canvas.backgroundImage;
    if(!obj) return;
    if (obj.filters && obj.filters.length > 1) 
      obj.filters.pop();
    
    switch(filter){
      case 'gray':
      obj.filters.push(new fabric.Image.filters.Grayscale());
      break;
      case 'sepia':
      obj.filters.push(new fabric.Image.filters.Sepia());
      break;
      case 'brownie':
      const _filter = new fabric.Image.filters.ColorMatrix({
        matrix: [0.59970, 0.34553, -0.27082, 0, 0.186, -0.03770, 0.86095, 0.15059, 0, -0.1449, 0.24113, -0.07441, 0.44972, 0, -0.02965, 0, 0, 0, 1, 0]
      });
      obj.filters.push(_filter);
      break;
      case 'invert':
      obj.filters.push(new fabric.Image.filters.Invert());
      break;
      
      default:
      break;
    }

    obj.applyFilters();
    this.canvas.renderAll();
  }

}

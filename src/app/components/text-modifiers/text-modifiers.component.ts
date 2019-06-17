import { Component, OnInit, Input, Output , EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Data } from 'src/app/models/data';

@Component({
  selector: 'app-text-modifiers',
  templateUrl: './text-modifiers.component.html',
  styleUrls: ['./text-modifiers.component.scss']
})
export class TextModifiersComponent implements OnInit  , OnChanges {

  options$: any;  
  showColorPicker$ : boolean;
  showFontPicker$  : boolean;
  showCanvasText: boolean;
  showTextArea: boolean;
  isDropup = true;
  selectedModifier: string;
  rowWidth: number;
  _showCanvasText: boolean;
  _canvas: any;

  @ViewChild('optionsRow') optionsRow: ElementRef;
  
  @Input() data: Data;

  @Input('canvas') set canvas(canvas : any)  { this._canvas = canvas; }
  get canvas(){ return this._canvas; }

  @Input('options') 
  set options(options) { this.options$ = options; }
  get options(): any { return this.options$;}

  @Output() onModify: EventEmitter<any> = new EventEmitter();
  @Output() onTextVisibilityChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.showColorPicker$ = this.showFontPicker$ = false;
    this.showCanvasText = true;
    this.showTextArea = true;
    this.rowWidth = this.optionsRow.nativeElement.offsetWidth;
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['showCanvasText']){
      this._showCanvasText = changes['showCanvasText'].currentValue;
    }
  }

  get modifiers(): Array<any> {
    return [{ title: 'Font' ,   icon : 'font.svg'  ,  value: 'fontFamily'} , { title: 'Color' , icon : 'color.svg' , value: 'fill' }, 
            { title: 'Stroke' , icon : 'stroke.svg' , value: 'stroke'}, { title: 'Shadow', icon : 'shadow.svg' , value: 'shadow' }, 
            { title: 'Opacity', icon : 'opacity.svg' ,  value: 'opacity' } , { title: 'Bg Tint', icon : 'color.svg' ,  value: 'textBackgroundColor' } 
           ];
  }

  getClass(modifier): boolean {
    // if(['stroke', 'shadow'].indexOf(modifier.value) > -1)
    //   return this.options[modifier.value] != '' || modifier.value == this.selectedModifier ;
    // else
      return modifier.value == this.selectedModifier;
  }


  onChange(value , attribute){
    switch(attribute){
      case 'effect':
      this.options.effect = value;
      break;

      case 'mouseOver':
      case 'mouseLeave':      
      this.options.fontFamily = value;      
      this.canvas.item(0).set('fontFamily', value);
      break;

      case 'fontFamily':
      this.options.fontFamily = value;      
      this.canvas.item(0).set('fontFamily', value);
      break;

      case 'fontStyle':
      case 'fontSize':
      case 'fontWeight':
      case 'fill':
      case 'opacity':
      case 'textBackgroundColor':
      this.options[attribute] = value;
      this.canvas.item(0).set(`${attribute}`, `${value}`);
      break;      
      
      case 'stroke':
      this.options[attribute] = value;
      this.canvas.item(0).set('stroke', value);
      this.canvas.item(0).set('strokeWidth' , this.options.strokeWidth);
      break;
      
      case 'shadow':
      this.options.shadow = value;
      const shadowWidth = this.options.shadowWidth;
      const shadow = `${value}` + ' ' + shadowWidth +'px ' +  shadowWidth + 'px ' + shadowWidth + 'px';
      this.canvas.item(0).set("shadow", shadow);
      break;      

      case 'width':
      attribute = this.selectedModifier == 'stroke' ? 'strokeWidth' : 'shadowWidth';
      this.options[attribute] = parseInt(value);
      if(attribute == 'shadowWidth'){
        const _shadow = `${this.options.shadow}` +  ' ' + value+ 'px ' +  value + 'px ' + value + 'px';
        value = _shadow;
        attribute = 'shadow';
        this.canvas.item(0).set(attribute, value);
      }
      else {
        this.canvas.item(0).set('stroke',  `${this.options.stroke}`);
        this.canvas.item(0).set('strokeWidth' , value);
      }
      
      break;
      
      default:
      break;
    }

    this.canvas.renderAll();
  }

  showOptions(attribute){
    this.showColorPicker$ = this.showFontPicker$ = false;
    this.selectedModifier = attribute;
    if(['stroke', 'shadow' , 'color' , 'textBackgroundColor'].indexOf(attribute) > -1) {
      this.showColorPicker$ = true;
      // if(['stroke', 'shadow' , 'textBackgroundColor'].indexOf(this.selectedModifier) > -1 && this.options[this.selectedModifier] != ''){
      //   this.options[this.selectedModifier] = '';
      //   const obj = this.canvas.item(0);
      //   obj.set(this.selectedModifier, '');
      //   this.canvas.renderAll();
      //   this.selectedModifier = '';
      //   return;
      // }

      
    }    
    else if(attribute == 'fontFamily') 
      this.showFontPicker$ = true;    
    else 
      this.showColorPicker$ = true;
    
  }

  _onTextVisibilityChange(event){
    this.showCanvasText = event.target.checked;
    if(event.target.checked){
      this.onTextVisibilityChange.emit(event);
    }
    else
      this.onTextVisibilityChange.emit(event);
  }

  get rangeVal() {
    if(this.selectedModifier == 'stroke')
      return this.options.strokeWidth;
    else if(this.selectedModifier == 'shadow')
      return this.options.shadowWidth;
    else if(this.selectedModifier == 'opacity')
      return this.options.opacity;
  }

}

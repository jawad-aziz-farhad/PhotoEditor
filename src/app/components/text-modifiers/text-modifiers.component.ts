import { Component, OnInit, Input, Output , EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Data } from 'src/app/models/data';

@Component({
  selector: 'app-text-modifiers',
  templateUrl: './text-modifiers.component.html',
  styleUrls: ['./text-modifiers.component.scss']
})
export class TextModifiersComponent implements OnInit  {

  options$: any;
  
  showColorPicker$ : boolean;
  showFontPicker$  : boolean;
  showCanvasText: boolean;
  isDropup = true;
  selectedModifier: string;
  rowWidth: number;
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
    this.rowWidth = this.optionsRow.nativeElement.offsetWidth;
  }

  get modifiers(): Array<any> {
    return [{ title: 'Font' ,   icon : 'font.svg'  ,  value: 'fontFamily'} , { title: 'Color' , icon : 'color.svg' , value: 'fill' }, 
            {title : 'Stroke' , icon : 'stroke.svg' , value: 'stroke'}, { title: 'Shadow', icon : 'shadow.svg' , value: 'shadow' }, 
            {title: 'Bg Tint',  icon : 'color.svg' ,  value: 'textBackgroundColor' } 
           ];
  }

  getClass(modifier): boolean {
    if(['stroke', 'shadow'].indexOf(modifier.value) > -1)
      return this.options$[modifier.value] != '' || modifier.value == this.selectedModifier ;
    else
      return modifier.value == this.selectedModifier;
  }

  on_Modify(modifier: any , attribute? : string){
    console.log('Modifier', modifier);    
    this.selectedModifier = modifier.value;
    this.showColorPicker$ = this.showFontPicker$ = false;
    if(this.selectedModifier == 'fontFamily')
      this.showFontPicker$ = true;
    else 
      this.showColorPicker$ = true;
    //this.onModify.emit({value: modifier.value , attribute: attribute});

  }

  onChange(value , attribute){
    switch(attribute){
      case 'effect':
      this.options.effect = value;
      break;
      case 'mouseOver':
      this.canvas.getActiveObject().set('fontFamily', value);
      break;
      case 'mouseLeave':      
      case 'fontFamily':
      this.options.fontFamily = value;      
      this.canvas.getActiveObject().set("fontFamily", value);
      break;
      case 'fontStyle':
      this.options.fontStyle = value;
      break;      
      case 'fontSize':
      this.options.fontSize =value;
      this.canvas.getActiveObject().set("fontSize", value);
      break;
      case 'fontWeight':
      this.options.fontWeight = value;
      this.canvas.getActiveObject().set("fontWeight", value);
      break;      
      case 'fill':
      this.options.fill = value;
      this.canvas.getActiveObject().set("fill", `${value}`);
      break;      
      case 'shadow':
      this.options.shadow = value;
      const shadowWidth = this.options.shadowWidth;
      const shadow = `${value}` + ' ' + shadowWidth +'px ' +  shadowWidth + 'px ' + shadowWidth + 'px';
      this.canvas.getActiveObject().set("shadow", shadow);
      break;      
      case 'shadowWidth':
      this.options.shadowWidth = value;
      const _shadow = `${this.options.shadow}` +  ' ' + value+ 'px ' +  value + 'px ' + value + 'px';
      this.canvas.getActiveObject().set("shadow", _shadow);
      break;      
      case 'strokeWidth':
      this.options.strokeWidth= value;
      this.canvas.getActiveObject().set("strokeWidth", value);
      break;      
      case 'stroke':
      this.canvas.getActiveObject().set('stroke', value);
      this.canvas.getActiveObject().set('strokeWidth' , this.options.strokeWidth);
      this.options.stroke = value;
      break;      
      case 'opacity':
      this.options.opacity =  value;
      this.canvas.getActiveObject().selectAll();
      this.canvas.getActiveObject().set('opacity', value);
      break;      
      case 'textBackgroundColor':
      this.options.textBackgroundColor =  value;
      this.canvas.getActiveObject().set('textBackgroundColor', value);
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
      console.log(1, attribute);
      this.showColorPicker$ = true;
      if(['stroke', 'shadow' , 'textBackgroundColor'].indexOf(this.selectedModifier) > -1 && this.options[this.selectedModifier] != ''){
        this.options[this.selectedModifier] = '';
        const obj = this.canvas.getActiveObject();
        obj.set(this.selectedModifier, '');
        this.canvas.renderAll();
        this.selectedModifier = '';
        return;
      }
    }    
    else if(attribute == 'fontFamily') {
      this.showFontPicker$ = true;    
    }
    else {
      this.showColorPicker$ = true;
    }
    
  }

  _onTextVisibilityChange(event){
    this.onTextVisibilityChange.emit(event);
  }
}

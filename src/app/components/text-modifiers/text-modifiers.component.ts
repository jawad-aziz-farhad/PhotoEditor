import { Component, OnInit, Input, Output , EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-text-modifiers',
  templateUrl: './text-modifiers.component.html',
  styleUrls: ['./text-modifiers.component.scss']
})
export class TextModifiersComponent implements OnInit {

  options$: any;
  showColorPicker$ : boolean;
  showFontPicker$  : boolean;
  selectedModifier: string;
  rowWidth: number;
  data: any;

  @ViewChild('optionsRow') optionsRow: ElementRef;
  @Input('options')
  set in(options) { this.options$ = options; }
  
  @Output() onModify: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.data = new Date();
    this.showColorPicker$ = this.showFontPicker$ = false;
    this.rowWidth = this.optionsRow.nativeElement.offsetWidth;
  }

  get modifiers(): Array<any> {
    return [{ title: 'Font' ,  icon : 'font.svg'  , value: 'fontFamily'} , { title: 'Color' , icon : 'color.svg' , value: 'fill' }, 
            {title : 'Stroke' , icon : 'stroke.svg' , value: 'stroke'}, { title: 'Shadow', icon : 'shadow.svg' , value: 'shadow' }, 
            {title: 'Bg Tint', icon : 'color.svg' , value: 'textBackgroundColor' } 
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
    this.onModify.emit({value: modifier.value , attribute: attribute});
  }
}

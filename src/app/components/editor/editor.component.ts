import { Component, OnInit, ViewChild, ElementRef, ViewChildren , QueryList} from '@angular/core';
import { Data } from 'src/app/models/data';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { fabric } from 'fabric';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent implements OnInit  {

  @ViewChild('canvasArea') canvasArea: ElementRef;

  canvas: any
  data: any;
  selectedOptions: any;
  selectedImage: string;

  overLayText: any;

  canvas_Width: number;
  canvas_Height: number;

  private closeResult: string;

  modalOpenedFor: string;
  canvasSizes: any = {small : { width: 500, height : 500 },
                              tall  : { width: 450, height : 900 },
                              wide  : { width: 900, height : 450 },
                              large : { width: 900, height : 900 },
                              };

  @ViewChildren('filters') filters : QueryList<any>;


  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.selectedImage = 'assets/images/image-1.jpg';
    this.data = new Data();
    this.overLayText = '';
    this.selectedOptions =  { effect: '', font_style: 'normal', font_size: 32 , font_family: 'Helvetica' , font_weight: 'normal' , text_align: 'center' , colors: '#000', stroke_styles : '', strokeWidth : 0, canvasSize : 'small' , text_shadow: 0, shadow_color: ''};
    this.canvas_Width = this.canvasSizes.small.width;
    this.canvas_Height= this.canvasSizes.small.height;
    this.modalOpenedFor = '';

    this.drawWithFabricJS(this.selectedImage);
  }  

  drawWithFabricJS(selectedImage){
    this.selectedImage = selectedImage;
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.setDimensions({width:this.canvasWidth, height:this.canvas_Height});
    this.canvas.clear();

    fabric.Image.fromURL(this.selectedImage, (img) => {

      this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas), {
      scaleX: this.canvas.getWidth() / img.width,
      scaleY: this.canvas.getHeight() / img.height
      });

      var text = new fabric.IText('Enter your text here', {
        fontSize: this.selectedOptions.font_size,
        fontFamily: this.selectedOptions.font_family,
        fill: this.selectedOptions.colors,
        textAlign: this.selectedOptions.text_align,
        stroke: this.selectedOptions.stroke_styles,
        strokeWidth: this.selectedOptions.strokeWidth,
      });
      this.canvas.add(text);
      this.canvas.centerObject(text);
      this.canvas.setActiveObject(text);
      this.canvas.bringToFront(text);

      this.canvas.renderAll();
    });
  }

  get images(): Array<any> {
    return ['assets/images/image-1.jpg', 'assets/images/image-2.jpg' , 'assets/images/image-3.jpg' , 'assets/images/image-4.jpg' , 'assets/images/image-5.jpg']
  }

  
  onAttributeChange(event , attribute){
    switch(attribute){
      case 'canvas_size':
      this.selectedOptions.canvasSize = event.target.value;
      this.setCanvasSize(event.target.value);
      break;
      case 'effect':
        this.selectedOptions.effect = event.target.value;
      break;
      case 'font_family':
      this.selectedOptions.font_family = event.target.value;
      break;
      case 'font_style':
      this.selectedOptions.font_style = event.target.value;
      break;
      case 'font_size':
      this.selectedOptions.font_size = event.target.value;
      break;
      case 'font_weight':
      this.selectedOptions.font_weight = event.target.value;
      break;
      case 'color':
      this.selectedOptions.colors = event.target.value;
      break;
      case 'text_shadow':
      this.selectedOptions.text_shadow = this.selectedOptions.text_shadow == 3 ? 0 : event.target.value;
      break;
      default:
      break;
    }

    this.drawWithFabricJS(this.selectedImage);
    
  }

  setCanvasSize(size){
    this.canvas_Width = this.canvasSizes[size].width;
    this.canvas_Height= this.canvasSizes[size].height;
  }

  textFont(): string {
    
    return this.selectedOptions.font_style  + " " +
    this.selectedOptions.font_weight + " " +
    this.selectedOptions.font_size + 'px' + " " +
    this.selectedOptions.font_family;

  }

  open(content, option) {
    this.modalOpenedFor = option;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log('Close Result', this.selectedOptions)
      this.drawWithFabricJS(this.selectedImage);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  get options() {
    return this.modalOpenedFor ? this.data[this.modalOpenedFor.toLowerCase().replace(' ', '_')] : [];
  }

  handlePropertyChange(event){
    console.log('Event', event.target.value , this.selectedOptions);
    if(event.target.checked){
      if(this.modalOpenedFor == 'Stroke Styles')
        this.selectedOptions.strokeWidth = 1;

      this.selectedOptions[this.modalOpenedFor.toLowerCase().replace(' ', '_')] = event.target.value;
    }
    else {
      if(this.modalOpenedFor == 'Stroke Styles')
        this.selectedOptions.strokeWidth = 0;
    }
    console.log('Selected Options', this.selectedOptions);
  }

  isString(value){ return typeof value == 'string' ? true : false;}

  isSelected(value){ return this.selectedOptions[this.modalOpenedFor.toLowerCase().replace(' ', '_')] = value ? true : false; }

  get canvasWidth(){
    const canvasArea = this.canvasArea.nativeElement.offsetWidth;
    console.log(this.canvas_Width,canvasArea);
    return ( this.canvas_Width > canvasArea ) ?  canvasArea - 20 : this.canvas_Width;
  }
}
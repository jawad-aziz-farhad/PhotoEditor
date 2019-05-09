import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Data } from 'src/app/models/data';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent implements OnInit , AfterViewInit {

  @ViewChild('visualization') visualization: ElementRef;
  @ViewChild('img') img: ElementRef;

  private context: CanvasRenderingContext2D;
  private element: HTMLImageElement;

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

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.selectedImage = 'assets/images/image-1.jpg';
    this.data = new Data();
    this.overLayText = '';
    this.selectedOptions =  { effect: '',  font_style: 'normal', font_size: 32 , font_family: 'Arial' , font_weight: 'normal' , text_align: '' , colors: '#000', stroke_styles : '#000', canvasSize : 'small' , text_shadow: 0, shadow_color: ''};
    this.canvas_Width = this.canvasSizes.small.width;
    this.canvas_Height= this.canvasSizes.small.height;
    this.modalOpenedFor = '';
  }

  ngAfterViewInit(){ 
    this.context = this.visualization.nativeElement.getContext("2d");
    this.element = this.img.nativeElement;
  }

  get images(): Array<any> {
    return ['assets/images/image-1.jpg', 'assets/images/image-2.jpg' , 'assets/images/image-3.jpg' , 'assets/images/image-4.jpg' , 'assets/images/image-5.jpg']
  }

  afterLoading() {
    this.context.canvas.width = this.canvas_Width;
    this.context.canvas.height= this.canvas_Height;

    this.context.canvas.className = this.selectedOptions.effect;
    this.context.filter = getComputedStyle(this.context.canvas).getPropertyValue('filter');

    this.context.clearRect(0, 0, this.canvas_Width, this.canvas_Height);
    if(this.overLayText)
      this.drawText(this.overLayText);
    else
      this.context.drawImage(this.element, 0, 0, this.canvas_Width, this.canvas_Height);
    
    console.log('Options', this.selectedOptions)
  }

  drawText(text){
    this.context.drawImage(this.element, 0, 0, this.canvas_Width, this.canvas_Height);
    
    this.overLayText = text;
    //this.context.save();
    //this.context.translate(100, 100);
    //this.context.rotate(-Math.PI / 4);

    this.context.shadowBlur = this.selectedOptions.text_shadow;

    

    this.context.font = this.textFont();
    
    this.context.textAlign = this.selectedOptions.text_align;
    this.context.fillStyle = this.selectedOptions.colors || '#000'; // fill text
    this.context.strokeStyle = this.selectedOptions.stroke_styles || '#000';
    this.context.lineWidth = 2.2;
    
    this.wrapText(text);

    //this.source = this.visualization.nativeElement.toDataURL();
}

wrapText(text) {
    const textX = this.canvas_Width/2;
    const textY = this.canvas_Height/2;
    const textWrapWidth  = this.canvas_Width - (this.canvas_Height / 9.00);
    const textWrapHeight = 120;
    var words = text.split(' ');
    var line = '';
    var currentTextY = textY;
    for(var n = 0; n < words.length; n++) {
        
        var testLine  = line + words[n] + ' ';
        var metrics   = this.context.measureText(testLine);
        var testWidth = metrics.width;

        if (testWidth > textWrapWidth && n > 0) {
            this.context.fillText(line, textX, currentTextY); // fill text
            this.context.strokeText(line, textX, currentTextY); // stroke border
            line = words[n] + ' ';
            currentTextY += textWrapHeight;
        }
        else {
          line = testLine;
        }
    }
    this.context.fillText(line, textX, currentTextY); // fill text
    this.context.strokeText(line, textX, currentTextY); // stroke border
    
    //  this.context.restore();
    this.drawRectangle();
  }

  drawRectangle(){
    const rectHeight   = this.canvas_Height / 2;
    const rectWidth    = this.canvas_Width - 100;
    const centerPoint  = this.canvas_Height - rectHeight;
    
    const startPoint   = centerPoint - centerPoint / 2 - 100;
    console.log(rectWidth, rectHeight,centerPoint , startPoint);

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

    if(attribute == 'canvas_size' || attribute == 'effect')
      this.afterLoading();
    else
      this.drawText(this.overLayText);
  }

  setCanvasSize(size){
    this.canvas_Width = this.canvasSizes[size].width;
    this.canvas_Height= this.canvasSizes[size].height;
  }

  textFont(): string {
    
    if(this.selectedOptions.text_shadow > 0){
      this.context.shadowColor = '#aaa';
      this.context.shadowOffsetX = 10;
      this.context.shadowOffsetY = 10;
    }
    else{
      this.context.shadowOffsetX = 0;
      this.context.shadowOffsetY = 0;
    }

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
      if(this.overLayText)
        this.drawText(this.overLayText);
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
    if(event.target.checked)
      this.selectedOptions[this.modalOpenedFor.toLowerCase().replace(' ', '_')] = event.target.value;

      console.log('Selected Options', this.selectedOptions);
  }

  isString(value){ return typeof value == 'string' ? true : false;}

  isSelected(value){ return this.selectedOptions[this.modalOpenedFor.toLowerCase().replace(' ', '_')] = value ? true : false; }
}

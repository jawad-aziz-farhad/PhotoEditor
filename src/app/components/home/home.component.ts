import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Data } from 'src/app/models/data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit , AfterViewInit {

  @ViewChild('visualization') visualization: ElementRef;
  @ViewChild('img') img: ElementRef;

  private context: CanvasRenderingContext2D;
  private element: HTMLImageElement;

  selectedImage : string;
  private data: any;
  private selectedOptions: any;

  private source : string;
  private overLayText: any;

  private canvas_Width: number;
  private canvas_Height: number;

  private canvasSizes: any = {small : { width: 500, height : 500 },
                              tall  : { width: 450, height : 900 },
                              wide  : { width: 900, height : 450 },
                              large : { width: 900, height : 900 },
                              };
  constructor() {}

  ngOnInit() {
    this.selectedImage = 'assets/images/image-1.jpg';
    this.data = new Data();
    this.overLayText = '';
    this.selectedOptions =  { effect: '',  font_style: 'normal', font_size: 32 , font_family: 'Arial' , font_weight: 'normal' ,textAlign: 'center' ,color: '#000', canvasSize : 'small'};
    
    this.source = '';

    this.canvas_Width = this.canvasSizes.small.width;
    this.canvas_Height= this.canvasSizes.small.height;
  }

  get images(): Array<any> {
    return ['assets/images/image-1.jpg', 'assets/images/image-2.jpg' , 'assets/images/image-3.jpg' , 'assets/images/image-4.jpg' , 'assets/images/image-5.jpg']
  }

  ngAfterViewInit(){ 
    this.context = this.visualization.nativeElement.getContext("2d");
    this.element = this.img.nativeElement;
  }

  afterLoading() {
    this.context.canvas.width = this.canvas_Width;
    this.context.canvas.height= this.canvas_Height;
    this.context.clearRect(0, 0, this.canvas_Width, this.canvas_Height);
    if(this.overLayText)
      this.drawText(this.overLayText);
    else
      this.context.drawImage(this.element, 0, 0, this.canvas_Width, this.canvas_Height);
    
  }

  drawText(text){
    this.context.drawImage(this.element, 0, 0, this.canvas_Width, this.canvas_Height);
    
    this.overLayText = text;
    // this.context.save();
    // this.context.translate(100, 100);
    // this.context.rotate(-Math.PI / 4);

    this.context.font = this.textFont();
    this.context.textAlign = this.selectedOptions.textAlign;
    this.context.fillStyle = this.selectedOptions.color || '#000'; // fill text
    this.context.strokeStyle = this.selectedOptions.color || '#000';
    this.context.lineWidth = 2.2;
    
    this.wrapText(text);

    this.source = this.visualization.nativeElement.toDataURL();
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
  }

  onAttributeChange(event , attribute) {
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
      this.selectedOptions.color = event.target.value;
      default:
      break;
    }

    if(attribute == 'canvas_size')
       this.afterLoading();
    else
      this.drawText(this.overLayText);
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

}

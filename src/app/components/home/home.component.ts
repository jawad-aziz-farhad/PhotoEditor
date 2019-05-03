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

  private currentText = "This is a Dummy Text !!!"

  selectedImage : string;
  private data: any;
  private selectedOptions: any;

  private source : string;
  private overLayText: any;

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
    this.selectedOptions =  { effect: '', font: 'italic 30px Arial' , font_style: '', font_size: 32 , font_family: '' , textAlign: 'center' ,color: '#000', canvasSize : this.canvasSizes.small};
    
    this.source = '';
  }

  get images(): Array<any> {
    return ['assets/images/image-1.jpg', 'assets/images/image-2.jpg' , 'assets/images/image-3.jpg' , 'assets/images/image-4.jpg' , 'assets/images/image-5.jpg']
  }

  ngAfterViewInit(){   
    this.context = this.visualization.nativeElement.getContext("2d");
    this.element = this.img.nativeElement;
  }

  afterLoading() {
    this.context.clearRect(0, 0, this.selectedOptions.canvasSize.width, this.selectedOptions.canvasSize.height);
    if(this.overLayText)
      this.drawText(this.overLayText);
    else
      this.context.drawImage(this.element, 0, 0, this.selectedOptions.canvasSize.width, this.selectedOptions.canvasSize.height);

  }

  drawText(text){
    this.context.drawImage(this.element, 0, 0, this.selectedOptions.canvasSize.width, this.selectedOptions.canvasSize.height);
    this.overLayText = text;
    
    this.context.font = this.selectedOptions.font;
    this.context.textAlign = this.selectedOptions.textAlign;
    this.context.fillStyle = this.selectedOptions.color || '#000'; // fill text
    this.context.strokeStyle = this.selectedOptions.color || '#000';
    this.context.lineWidth = 2.2;
    
    this.wrapText(text);

    this.source = this.visualization.nativeElement.toDataURL();
}


wrapText(text) {
    const textX = this.selectedOptions.canvasSize.width/2;
    const textY = this.selectedOptions.canvasSize.height/2;
    const textWrapWidth  = this.selectedOptions.canvasSize.width - (this.selectedOptions.canvasSize.height / 9.00);
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
  }

  onAttributeChange(event , attribute){
    switch(attribute){
      case 'canvas_size':
      this.selectedOptions.canvasSize = event.target.value;
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
      case 'color':
      this.selectedOptions.color = event.target.value;
      default:
      break;
    }

    this.afterLoading();
  }

}

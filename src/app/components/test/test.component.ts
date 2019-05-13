import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Renderer2 } from '@angular/core';
import { fabric } from 'fabric';
import { Data } from 'src/app/models/data';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.sass']
})
export class TestComponent implements OnInit  {

    @ViewChild('visualization') visualization: ElementRef;
    @ViewChild('img') img: ElementRef;

    private context: CanvasRenderingContext2D;
    private element: HTMLImageElement;

    data: any;
    selectedOptions: any;
    selectedImage: string;

    canvas: any;
    canvas_Width: number;
    canvas_Height: number;

    overLayText: string;
    private closeResult: string;

    modalOpenedFor: string;
    canvasSizes: any = {small : { width: 500, height : 500 },
                              tall  : { width: 450, height : 900 },
                              wide  : { width: 900, height : 450 },
                              large : { width: 900, height : 900 },
                              };
    private bgImage: any = {};

    rotationAmount = 0;

    canvasOriginalWidth = 800;
    canvasOriginalHeight = 600;
    canvasWidth = 800;
    canvasHeight = 600;
    imgWidth;
    imgHeight;    
    canvasScale = 1;
    photoUrlLandscape = 'https://presspack.rte.ie/wp-content/blogs.dir/2/files/2015/04/AMC_TWD_Maggie_Portraits_4817_V1.jpg';
    
    constructor() {}

    get rotateAngle() {
        return this.rotationAmount;
    }

    rotateText(){
        this.rotationAmount = this.rotationAmount >= 180 ? 0 : this.rotationAmount + 45;
        console.log('Roation Amount', this.rotationAmount);
    }

    ngAfterViewInit(){ 
        this.context = this.visualization.nativeElement.getContext("2d");
        //this.element = this.img.nativeElement;
        this.afterLoading();
    }

    ngOnInit() {
        this.selectedImage = 'assets/images/image-1.jpg';
        this.data = new Data();
        this.overLayText = '';
        this.selectedOptions =  { effect: '',  font_style: 'normal', font_size: 32 , font_family: 'Arial' , font_weight: 'normal' , text_align: '' , colors: '#000', stroke_styles : '#000', canvasSize : 'small' , text_shadow: 0, shadow_color: ''};
        this.canvas_Width = this.canvasSizes.small.width;
        this.canvas_Height= this.canvasSizes.small.height;
        this.bgImage = {};


    }

    get images(): Array<any> {
        return ['assets/images/image-1.jpg', 'assets/images/image-2.jpg' , 'assets/images/image-3.jpg' , 'assets/images/image-4.jpg' , 'assets/images/image-5.jpg']
    }

    afterLoading() {       

        this.canvas = new fabric.Canvas('canvas');

        // create a rectangle object
        var text = new fabric.IText("Hello world !", {
          fill: '#000000',
          fontSize: 18,
          textAlign:'center',
          top: this.canvas.getHeight() / 2,
          left: this.canvas.getWidth() / 2 - 50,
          padding: 10,
          hasRotatingPoint: true,
          editable: true
        });

        var img = new fabric.Image(this.element, {
            left: 100,
            top: 100,
            width: this.canvas_Width,
            height: this.canvas_Height,
          });
        
        var group = new fabric.Group([img, text], {
            left: 50,
            top: 50,
        });

        // this.canvas.setBackgroundImage(this.photoUrlLandscape, this.canvas.renderAll.bind(this.canvas), {
        //     backgroundImageOpacity: 0.5,
        //     backgroundImageStretch: false
        // });

        fabric.Image.fromURL(this.images[0], (oImg) => {
            oImg.scaleToWidth(this.canvas.getWidth());
            oImg.scaleToHeight(this.canvas.getHeight());
            this.canvas.add(oImg);
            //text.set("top",  (img.getBoundingRect().height / 2) - (text.width / 2));
            //text.set("left", (img.getBoundingRect().width / 2) - (text.height / 2));
            
            //this.canvas.add(new fabric.Group([oImg, text ]));
            this.canvas.add(text);
            text.bringToFront();
            this.canvas.setActiveObject(text);

            this.canvas.renderAll();
        });

        // this.setCanvasZoom();
        // setTimeout(()  => {
        //     this.setCanvasBackgroundImageUrl(this.photoUrlLandscape);
        // }, 50)
    }

    // Select all objects
    selectAllCanvasObjects(){
        var object_length   = parseInt(this.canvas.getObjects().length) - 1;
        for(var i = 0; i <= object_length; i++)
        {
            this.canvas.setActiveObject(this.canvas.item(i));

            var obj = this.canvas.getActiveObject();
            var object_type = obj.type;

            if(object_type == "text")
            {
                //Write your code here
                this.canvas.renderAll();
            }
        }
        this.canvas.deactivateAllWithDispatch();
        this.canvas.renderAll();
    }


    onAttributeChange(event , attribute){
        switch(attribute){
          case 'canvas_size':
          this.selectedOptions.canvasSize = event.target.value;
          //this.setCanvasSize();
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

        this.afterLoading();
    
        
      }
    
    
    setCanvasZoom() {
        this.canvasWidth =  this.canvasOriginalWidth *  this.canvasScale;
        this.canvasHeight =  this.canvasOriginalHeight *  this.canvasScale;

        this.canvas.setWidth( this.canvasWidth);
        this.canvas.setHeight( this.canvasHeight);
    }
    setCanvasSize(sizeObject) {
        this.canvas.setWidth(sizeObject.width);
        this.canvas.setHeight(sizeObject.height);
    }

    setCanvasBackgroundImageUrl(url) {
        
        if (url && url.length > 0) {
            fabric.Image.fromURL(url, (img) => {                
                this.bgImage = img;
                console.log('Image', this.bgImage); 
                this.scaleAndPositionImage();
            });
        } else {
            this.canvas.backgroundImage = 0;
            this.canvas.setBackgroundImage('', this.canvas.renderAll.bind(this.canvas));

            this.canvas.renderAll();
        }
    }

    scaleAndPositionImage() {

        this.setCanvasZoom();

        var canvasAspect = this.canvasWidth / this.canvasHeight;
        var imgAspect = this.bgImage.width / this.bgImage.height;
        var left, top, scaleFactor;

        if (canvasAspect >= imgAspect) {
            let scaleFactor = this.canvasWidth / this.bgImage.width;
            left = 0;
            top = -((this.bgImage.height * scaleFactor) - this.canvasHeight) / 2;
        } else {
            let scaleFactor = this.canvasHeight / this.bgImage.height;
            top = 0;
            left = -((this.bgImage.width * scaleFactor) - this.canvasWidth) / 2;

        }

        this.canvas.setBackgroundImage(this.bgImage, this.canvas.renderAll.bind(this.canvas), {
            top: top,
            left: left,
            originX: 'left',
            originY: 'top',
            scaleX: scaleFactor,
            scaleY: scaleFactor
        });
        this.canvas.renderAll();

    }
}

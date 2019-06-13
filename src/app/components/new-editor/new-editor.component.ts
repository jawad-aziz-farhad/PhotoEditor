import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Data } from 'src/app/models/data';
import { fabric } from 'fabric';
import 'fabric-customise-controls';
import Croppie, {CroppieOptions, ResultOptions} from "croppie/croppie";

@Component({
  selector: 'app-new-editor',
  templateUrl: './new-editor.component.html',
  styleUrls: ['./new-editor.component.scss']
})
export class NewEditorComponent implements OnInit , AfterViewInit {

  @ViewChild('croppieContainer') croppieContainer: ElementRef;
  @ViewChild('divHandle') divHandle; ElementRef;
  croppieOptions: CroppieOptions;
  resultOptions: ResultOptions;
  initialZoom: number = 1;

  private defaultCroppieOptions: CroppieOptions;
  private defaultResultOptions: ResultOptions & { type: 'base64' } = {
    type: 'base64',
    size: 'viewport',
    format: 'png'
  };
  
  private cropper: Croppie;


  @ViewChild('canvasArea') canvasArea: ElementRef;
  @ViewChild('canvas') _canvas: ElementRef;
  @ViewChild('optionsRow') optionsRow: ElementRef;

  canvas: any
  data: any;
  selectedOptions: any;
  selectedImage: string;
  toggle : boolean;

  overLayText: any;

  canvas_Width: number;
  canvas_Height: number;

  showTextArea: boolean;
  showResizeArea: boolean;
  showColorPicker$: boolean;
  showFontPicker$: boolean;
  showTextAlignPicker$: boolean;
  showTextBackgroundColorPicker$: boolean;

  showCanvasText: boolean;

  modalOpenedFor: string;
  canvasSizes: any = {small : { width: 500, height : 500 },
                      tall  : { width: 450, height : 900 },
                      wide  : { width: 900, height : 450 },
                      large : { width: 900, height : 900 },
                    };

  color: string = "#000";                            
  rowWidth: any;
  zoomLevel: any;
  canvas$: any;
  isDropup: boolean;
  showCanvas: boolean = true;
  
  constructor() { }

  ngOnInit() {
    this.selectedImage = 'assets/images/image-1.jpg';
    this.data = new Data();
    this.toggle = false;
    this.overLayText = '';
    this.selectedOptions =  { filter: 'none', fontStyle: 'normal', fontSize: 32 , fontFamily: 'Helvetica' , fontWeight: 'normal' , textAlign: 'center' , fill: '#000', 
                              stroke : '', strokeWidth : 3, canvasSize : 'small' , shadow: '' , shadowWidth: 3 , opacity : 1 , textBackgroundColor : '' , angle: 0};
    this.canvas_Width = this.canvasSizes.small.width;
    this.canvas_Height= this.canvasSizes.small.height;
    this.modalOpenedFor = '';   
   
    this.showTextArea   = true;
    this.showCanvasText = true;
    this.showResizeArea = true;
    this.showCanvas     = true;

    this.showColorPicker$ = false;
    this.showFontPicker$  = false;
    this.showTextAlignPicker$ = false;
    this.showTextBackgroundColorPicker$ = false;

    this.isDropup = true;

    this.zoomLevel = 0;
    this.setUpCanvas(this.selectedImage);

  }  

  ngAfterViewInit(){
  }

  setCroppie() {
    
    if(!this.cropper){
      this.croppieOptions = {
        viewport: { width: this.canvasSizes[this.selectedOptions.canvasSize].width, height: this.canvasSizes[this.selectedOptions.canvasSize].height, type: 'square' }, 
        points: [],
        showZoomer: true,
        enableResize: false,
        enableOrientation: true,
        boundary: { width: this.canvasArea.nativeElement.offsetWidth, height: this.canvasArea.nativeElement.offsetHeight - 75 }
      };
      this.cropper = new Croppie(this.croppieContainer.nativeElement, this.croppieOptions);
      this.cropper.zoom = 0;
    }
    else 
      this.cropper.zoom = this.cropper.get().zoom;
    
    this.cropper.bind( {
       url: this.selectedImage , 
       points: this.cropper.options.points ,
       //orientation: this.cropper.data.orientation,
       zoom: this.cropper.zoom
      }).then( response => {
    });
  }

  setUpCanvas(image) {  
    
    this.zoomLevel = 0;
    this.canvas = new fabric.Canvas('canvas');    
    this.canvas.setWidth(this.canvasWidth);
    this.canvas.setHeight(this.canvas_Height);

    fabric.Image.fromURL(image, img => {

      img.set({
        scaleX : this.canvas.getWidth() / img.width,   //new update
        scaleY: this.canvas.getHeight() / img.height,   //new update,
        originX: "center", 
        originY: "center",
        selectable: false,
        centeredScaling: true
      });

      // img.scaleToWidth(this.canvas.getWidth() );
      // img.scaleToHeight(this.canvas.getHeight() );
      
      if ( Math.max(img.width, img.height) > 2048) {
        let fscale = 2048 / Math.max(img.width, img.height);
        img.filters.push(new fabric.Image.filters.Resize({scaleX: fscale, scaleY: fscale}));
        img.applyFilters();
      }

    img.setCoords();  
    this.canvas.centerObject(img);
    this.canvas.setBackgroundImage(img , this.canvas.renderAll.bind(this.canvas));

    this.setText();

    
    let panning = false;
    this.canvas.on('mouse:up', (e) => {
      panning = false;
    });      
    this.canvas.on('mouse:down', (e) => {
      panning = true;
    });
    this.canvas.on('mouse:move',  (e) => {
      if (panning && e && e.e && this.canvas.getZoom() > 1) {
        const delta = new fabric.Point(e.e.movementX, e.e.movementY);
        this.canvas.relativePan(delta);
      }
    });    

    this.canvas.on('object:moving', function (e) {
      var obj = e.target;
        // if object is too big ignore
      if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
        return;
      }        
      obj.setCoords();        
      // top-left  corner
      if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
      }
      // bot-right corner
      if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
        obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
      }
    });
      this.canvas.renderAll();
      this.canvas$ = this.canvas;
    });
  }

  setText(){

    var HideControls = {
      'tl': true,
      'tr': true,
      'bl': false,
      'br': true,
      'ml': false,
      'mt': false,
      'mr': false,
      'mb': false,
      'mtr': false
    };

    let text = new fabric.IText(this.overLayText ? this.overLayText : 'Click here to edit text', {
      angle: this.selectedOptions.angle,
      fontSize: this.selectedOptions.fontSize,
      fontFamily: this.selectedOptions.fontFamily,
      fill: "#C0C0C0",
      textAlign: this.selectedOptions.textAlign,      
      strokeWidth: this.selectedOptions.stroke ? this.selectedOptions.strokeWidth : 0 ,
      paintFirst: 'stroke',
      stroke: this.selectedOptions.stroke,
      shadow : this.selectedOptions.shadow ? this.selectedOptions.shadowWidth : 0,
      strokeLineCap: 'round',
      opacity: this.selectedOptions.opacity,
      textBackgroundColor : this.selectedOptions.textBackgroundColor,
      borderColor: '#00c6d2',
      editingBorderColor: '#00c6d2',
      borderScaleFactor: 2,
      padding: 15,
      originX: 'center',
      originY: 'center'
    });

    text.setControlsVisibility(HideControls);

    this.setTextEvents(text); 
    this.canvas.add(text);
    this.canvas.centerObject(text);
    this.canvas.setActiveObject(text);
    this.canvas.bringToFront(text);

    this.customizeControls();
  }

  setTextEvents(text){

    this.canvas.on('text:changed', (e) => {
      var obj = this.canvas.getActiveObject();
      
      // Text now empty, show placeholder:
      if(obj.text === '')
      {
        obj.text = 'Click here to edit text';
        obj.set('opacity', 0.3);
        obj.set('showplaceholder', true); // Set flag on IText object
        obj.setCoords();
        this.canvas.renderAll();
      }
      else if(obj.text === 'Click here to edit text'){
        obj.selectAll();
        obj.text = "";
        obj.selectable = true;
        obj.fill = this.selectedOptions.fill;
        obj.hiddenTextarea.value = "";
        obj.dirty = true;
        obj.setCoords();
        this.canvas.renderAll();
      }

      
      // Placeholder currently active:
      else if(obj.get('showplaceholder') === true)
        {
        // The text in the IText should now be the placeholder plus the character that  was pressed, so text and placeholder should be different, so remove the placeholder (unless the pressed key was backspace in which case do nothing):
        if(obj.text !== 'Click here to edit text')
          {           
          // New char should be at position 0, so remove placeholder from rest of text:
          obj.text = obj.text.substr(0,1);
          obj._updateTextarea();
          obj.set('opacity', 1);
          obj.set('showplaceholder', false); // Remove flag on IText object
          obj.setCoords();
          this.canvas.renderAll();	
          }
        }
      });
      
      // Editing mode is entered on the IText
      this.canvas.on('text:editing:entered', (e) => {
      var obj = this.canvas.getActiveObject();
      
      // If the placeholder is active, move the cursor to position 0 so we
      // can trim the string correctly when typing starts:
      if(obj.text === 'Click here to edit text')
        {
          // Move cursor to beginning of line:
          obj.selectAll();
          obj.text = "";
          obj.selectable = true;
          obj.fill = this.selectedOptions.fill;
          obj.hiddenTextarea.value = "";
          obj.dirty = true;
          obj.setCoords();
          this.canvas.renderAll();
        }
      });

      text.on("editing:exited",  (e)  => {
        var obj = this.canvas.getActiveObject();
        if(obj.text == ''){
          this.canvas.remove(obj);
          this.setText();   
          this.canvas.renderAll();
        }
      });
  }

  customizeControls() {

    const icons = [
      'assets/_images/circle.svg',
      'assets/_images/rotate.svg',
      'assets/_images/expand.svg'
    ];

    fabric.Canvas.prototype['customiseControls']({
      tl: {
        action: (e, target) => {
          this.selectedOptions.angle = 0;
          this.showCanvasText = false;
          this.canvas.remove(target);
        },
        cursor: 'pointer'
      },
      tr: {
        action: 'rotate',
			  cursor: 'pointer'
       
      },
      br: {
        action: 'scale',
      },    
    }, () => {
      this.canvas.renderAll();
    });
    
    this.canvas.item(0)['customiseCornerIcons']({
      settings: {
        borderColor: '#00c6d2',
        editingBorderColor: '#00c6d2',
        cornerBackgroundColor: 'white',
        cornerSize: 30,
        cornerShape: 'circle',
        cornerPadding: 10
      },
      tl: {
        icon: icons[0]
      },
      tr: {
        icon: icons[1]        
      },    
      br: {
        icon: icons[2]
      }   
    }, () => {
      this.canvas.renderAll();
    });
  }

  onAttributeChange(value , attribute){
    switch(attribute){
      case 'canvasSize':
      this.selectedOptions.angle = 0;
      this.selectedOptions.canvasSize = value;
      this.setCanvasSize(value);
      break;
      case 'imageChange':
      this.selectedImage = value;
      if(this.cropper)
      this.cropper.destroy();
      break;      
      case 'effect':
      this.selectedOptions.effect = value;
      break;
      case 'mouseOver':
      this.canvas.getActiveObject().set('fontFamily', value);
      break;
      case 'mouseLeave':      
      case 'fontFamily':
      this.selectedOptions.fontFamily = value;      
      this.canvas.getActiveObject().set("fontFamily", value);
      break;
      case 'fontStyle':
      this.selectedOptions.fontStyle = value;
      break;      
      case 'fontSize':
      this.selectedOptions.fontSize =value;
      this.canvas.getActiveObject().set("fontSize", value);
      break;
      case 'fontWeight':
      this.selectedOptions.fontWeight = value;
      this.canvas.getActiveObject().set("fontWeight", value);
      break;      
      case 'color':
      this.selectedOptions.fill = value;
      this.canvas.getActiveObject().set("fill", `${value}`);
      break;      
      case 'shadow':
      this.selectedOptions.shadow = value;
      const shadowWidth = this.selectedOptions.shadowWidth;
      const shadow = `${value}` + ' ' + shadowWidth +'px ' +  shadowWidth + 'px ' + shadowWidth + 'px';
      this.canvas.getActiveObject().set("shadow", shadow);
      break;      
      case 'shadowWidth':
      this.selectedOptions.shadowWidth = value;
      const _shadow = `${this.selectedOptions.shadow}` +  ' ' + value+ 'px ' +  value + 'px ' + value + 'px';
      this.canvas.getActiveObject().set("shadow", _shadow);
      break;      
      case 'strokeWidth':
      this.selectedOptions.strokeWidth= value;
      this.canvas.getActiveObject().set("strokeWidth", value);
      break;      
      case 'stroke':
      this.canvas.getActiveObject().set('stroke', value);
      this.canvas.getActiveObject().set('strokeWidth' , this.selectedOptions.strokeWidth);
      this.selectedOptions.stroke = value;
      break;      
      case 'opacity':
      this.selectedOptions.opacity =  value;
      this.canvas.getActiveObject().selectAll();
      this.canvas.getActiveObject().set('opacity', value);
      break;      
      case 'textBackgroundColor':
      this.selectedOptions.textBackgroundColor =  value;
      this.canvas.getActiveObject().set('textBackgroundColor', value);
      break;
      default:
      break;
    }

    if(attribute == 'canvasSize' || attribute == 'imageChange'){
      this.canvas.clear();
      this.canvas.dispose();
      this.selectedOptions.filter = 'none';
      this.setUpCanvas(this.selectedImage);
    }
    else
      this.canvas.renderAll();
  }

  setCanvasSize(size){
    this.canvas_Width = this.canvasSizes[size].width;
    this.canvas_Height= this.canvasSizes[size].height;
  }

  createImageRatioSize(maxW, maxH, imgW, imgH) {
    var ratio = imgH / imgW;
    if (imgW >= maxW && ratio <= 1){
        imgW = maxW;
        imgH = imgW * ratio;
    } else if(imgH >= maxH){
        imgH = maxH;
        imgW = imgH / ratio;
    } else if (ratio !== 1) {
        if (imgW > imgH) {
            imgW = maxW;
            imgH = imgW * ratio;
        } else {
            imgH = maxH;
            imgW = imgH / ratio;
        }
    }

    return {
      w: imgW,
      h: imgH
    };
  }
  
  get images(): Array<any> {
    return ['assets/images/image-1.jpg', 'assets/images/image-2.jpg' , 'assets/images/image-3.jpg' , 'assets/images/image-4.jpg' , 'assets/images/image-5.jpg']
  }

  get canvasWidth(){
    const canvasArea = this.canvasArea.nativeElement.offsetWidth;
    return ( this.canvas_Width > canvasArea ) ?  canvasArea - 20 : this.canvas_Width;
  }

  get options() {
    return this.modalOpenedFor ? this.data[this.modalOpenedFor] : [];
  }

  onCanvasTextChange(event){
    if(event.target.checked)
      this.setText();
    else {
      const obj = this.canvas.getActiveObject();
      this.canvas.remove(obj);
      this.selectedOptions.angle = 0;
    }
    this.showCanvasText = event.target.checked;
    this.canvas.renderAll();
  }

  showOptions(attribute){
    this.showColorPicker$ = this.showFontPicker$ = this.showTextAlignPicker$ = false;
    this.modalOpenedFor = attribute;
    if(['stroke', 'shadow' , 'color' , 'textBackgroundColor'].indexOf(attribute) > -1){
      this.showColorPicker$ = true;
      if(['stroke', 'shadow' , 'textBackgroundColor'].indexOf(this.modalOpenedFor) > -1 && this.selectedOptions[this.modalOpenedFor] != ''){
        this.selectedOptions[this.modalOpenedFor] = '';
        const obj = this.canvas.getActiveObject();
        obj.set(this.modalOpenedFor, '');
        this.canvas.renderAll();
        this.modalOpenedFor = '';
        return;
      }
    }
    else if(attribute == 'fontFamily'){
      this.showFontPicker$ = true;
    }
    else if(attribute == 'textAlign'){
      this.showTextAlignPicker$ = true;
    }
    else if(attribute == 'textBackgroundColor')
      this.showTextBackgroundColorPicker$ = true;
  }

  dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
     bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  saveCanvasAsImage(){
    let obj = this.canvas.getActiveObject();
    if(obj.text == 'Click here to edit text'){
      this.canvas.remove(obj);
      this.canvas.renderAll();
    }
    const link = document.createElement("a");
    const imgData = this.canvas.toDataURL({format: 'png', multiplier: 4});
    const blob = this.dataURLtoBlob(imgData);
    const objurl = URL.createObjectURL(blob);
    link.download = new Date().getTime() + ".png";
    link.href = objurl;
    link.click();
  }

  get rangeVal() {
    if(this.modalOpenedFor == 'stroke')
      return this.selectedOptions.strokeWidth;
    else if(this.modalOpenedFor == 'shadow')
      return this.selectedOptions.shadowWidth;
    else if(this.modalOpenedFor == 'opacity')
      return this.selectedOptions.opacity;
  }

  onResizeBtnClick(event){
    if(event.action === 'reposition'){
      this.showCanvas = !this.showCanvas;
      if(!this.showCanvas)
       this.setCroppie();
    }
    else if(event.action === 'done'){
      console.log(this.cropper.get());
      this.cropper.options.points = this.cropper.get().points;
      this.cropper.data.orientation = this.cropper.get().orientation;
      console.log('Cropper ', this.cropper);
      let resultOptions = this.resultOptions ? this.resultOptions : this.defaultResultOptions;
      this.cropper.result(resultOptions).then(result => {
        this.showCanvas = true;
        this.canvas.clear();
        this.canvas.dispose();
        this.selectedOptions.filter = 'none';
        this.setUpCanvas(result);
      });
    }
    else if(event.action === 'rotate'){
      this.cropper.rotate(90);
    }
  }

}


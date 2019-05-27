import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Data } from 'src/app/models/data';
import { fabric } from 'fabric';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit , AfterViewInit {

  @ViewChild('canvasArea') canvasArea: ElementRef;
  @ViewChild('optionsRow') optionsRow: ElementRef;

  canvas: any
  data: any;
  selectedOptions: any;
  selectedImage: string;
  toggle : boolean;

  overLayText: any;

  canvas_Width: number;
  canvas_Height: number;

  showShapeArea: boolean;
  showFilterArea: boolean;
  showTextArea: boolean;
  showResizeArea: boolean;
  showColorPicker$: boolean;
  showFontPicker$: boolean;
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
  isDropup: boolean;
  
  constructor() { }

  ngOnInit() {
    this.selectedImage = 'assets/images/image-1.jpg';
    this.data = new Data();
    this.toggle = false;
    this.overLayText = '';
    this.selectedOptions =  { filter: 'none', fontStyle: 'normal', fontSize: 32 , fontFamily: 'Helvetica' , fontWeight: 'normal' , fill: '#000', 
                              stroke : '', strokeWidth : 3, canvasSize : 'small' , shadow: '' , shadowWidth: 3 , opacity : 1 , textBackgroundColor : ''};
    this.canvas_Width = this.canvasSizes.small.width;
    this.canvas_Height= this.canvasSizes.small.height;
    this.modalOpenedFor = '';   
   
    this.showShapeArea  = true;
    this.showFilterArea = true;
    this.showTextArea   = true;
    this.showCanvasText = true;
    this.showResizeArea = true;

    this.showColorPicker$ = false;
    this.showFontPicker$  = false;
    this.showTextBackgroundColorPicker$ = false;

    this.isDropup = true;

    this.zoomLevel = 0;

    //this.rowWidth = this.optionsRow.nativeElement.offsetWidth;

   this.setUpCanvas(this.selectedImage);
  }  

  ngAfterViewInit(){
    console.log('Color Picker ', this.rowWidth);
  }

  setUpCanvas(image) {  
    
    this.zoomLevel = 0;
    this.canvas = new fabric.Canvas('canvas');    
    this.canvas.setWidth(this.canvasWidth);
    this.canvas.setHeight(this.canvas_Height);
    
    fabric.Image.fromURL(image, img => {

      //img.scaleToWidth(this.canvas.getWidth());
      //img.scaleToHeight(this.canvas.getHeight());
     
      img.set({
        scaleX :this.canvas.getWidth() / img.width,   //new update
        scaleY: this.canvas.getHeight() / img.height,   //new update,
        originX: "center", 
        originY: "center",
        selectable: false,
        centeredScaling: true
      });

      this.canvas.centerObject(img);
      img.setCoords();
      
      if ( Math.max(img.width, img.height) > 2048) {
        let fscale = 2048 / Math.max(img.width, img.height);
        img.filters.push(new fabric.Image.filters.Resize({scaleX: fscale, scaleY: fscale}));
        img.applyFilters();
      }

    this.canvas.add(img);

    this.setText();

    this.canvas.setZoom(1);

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

      //this.mouseWheel();
      this.canvas.renderAll();
    });
  }

  setText(){
    let text = new fabric.IText(this.overLayText ? this.overLayText : 'Click here to edit text', {
      fontSize: this.selectedOptions.fontSize,
      fontFamily: this.selectedOptions.fontFamily,
      fill: "#C0C0C0",
      stroke: this.selectedOptions.stroke,
      strokeWidth: this.selectedOptions.stroke ? this.selectedOptions.strokeWidth : 0 ,
      shadow : this.selectedOptions.shadow ? this.selectedOptions.shadowWidth : 0,
      opacity: this.selectedOptions.opacity,
      textBackgroundColor : this.selectedOptions.textBackgroundColor,
      borderColor: '#00c6d2',
      editingBorderColor: '#00c6d2',
      cornerSize : 5
    });

    this.setTextEvents(text); 
    this.canvas.add(text);
    this.canvas.centerObject(text);
    this.canvas.setActiveObject(text);
    this.canvas.bringToFront(text);

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

  drawWithFabricJS(selectedImage){
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.setDimensions({width:this.canvasWidth, height:this.canvas_Height});
    this.canvas.clear();
    
    fabric.Image.fromURL(selectedImage, (img) => {

      img.scaleToWidth(this.canvas.getWidth());
      img.scaleToHeight(this.canvas.getHeight());
      
      if ( Math.max(img.width, img.height) > 2048) {
        let fscale = 2048 / Math.max(img.width, img.height);
        img.filters.push(new fabric.Image.filters.Resize({scaleX: fscale, scaleY: fscale}));
        img.applyFilters();
      }

      this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas), {
        scaleX: this.canvas.getWidth() / img.width,
        scaleY: this.canvas.getHeight() / img.height
      });


      let text = new fabric.IText(this.overLayText ? this.overLayText : 'Enter your text here', {
        fontSize: this.selectedOptions.fontSize,
        fontFamily: this.selectedOptions.fontFamily,
        fill: "#C0C0C0",
        stroke: this.selectedOptions.stroke,
        strokeWidth: this.selectedOptions.strokeWidth,
      });
      this.canvas.add(text);
      this.canvas.centerObject(text);
      this.canvas.setActiveObject(text);
      this.canvas.bringToFront(text);

      text.on("editing:entered",  (e)  => {
        var obj = this.canvas.getActiveObject();
        if(obj.text === 'Enter your text here')
        {
          obj.selectAll();
          obj.text = "";
          obj.fill = this.selectedOptions.fill;
          obj.hiddenTextarea.value = "";
          obj.dirty = true;
          obj.setCoords();
          this.canvas.renderAll();
        }
        else{
          this.overLayText = obj.text;
        }
    });

      this.canvas.renderAll();
    });
  }

  changeColor(color){
    this.selectedOptions.color = `${color}`;
    this.canvas.getActiveObject().set("fill", `${color}`);
    this.canvas.renderAll();
  }
  
  onAttributeChange(value , attribute){
    switch(attribute){
      case 'canvasSize':
      this.selectedOptions.canvasSize = value;
      this.setCanvasSize(value);
      break;
      case 'imageChange':
      this.selectedImage = value;
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
      case 'fill':
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

  
  handlePropertyChange(event){
    if(['fontFamily'].indexOf(this.modalOpenedFor) > -1 && event.target.checked) 
      this.onAttributeChange(event.target.value , this.modalOpenedFor);
    else if(['stroke' , 'shadow' , 'fill' , 'textBackgroundColor'].indexOf(this.modalOpenedFor) > -1) {
      if( typeof event.color != 'undefined')
        this.onAttributeChange(event.color.hex , this.modalOpenedFor);
      else{
        const attribute = this.modalOpenedFor == 'stroke' ? 'strokeWidth' : 'shadowWidth';
        this.onAttributeChange(event.target.value , attribute);
      }
    
    }
  }

  applyFilter(filter){
    this.selectedOptions.filter = filter;
    const obj = this.canvas.item(0);
    if (obj.filters.length > 1) 
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
    }
    this.showCanvasText = event.target.checked;
    this.canvas.renderAll();
  }

  showOptions(data){
    let attribute = '';
    if(data.attribute)
      attribute = data.attribute; 
    else
      attribute = data.value;  

    this.showColorPicker$ = this.showFontPicker$ = false;
    this.modalOpenedFor = attribute;
    if(['stroke', 'shadow' , 'fill' , 'textBackgroundColor'].indexOf(attribute) > -1){
      this.showColorPicker$ = true;
      if(['stroke', 'shadow'].indexOf(this.modalOpenedFor) > -1 && this.selectedOptions[this.modalOpenedFor] != ''){
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

  setZoom(event) {    
    // console.log('Zoom Value', event.target.value);
    // const zoomLevel = event.target.value;
    // if(zoomLevel > 1)
    //   this.canvas.setZoom(this.canvas.getZoom() * zoomLevel);
    // else
    //   this.canvas.setZoom(1);
    // this.canvas.renderAll();

    let status = '';
    const zoomLevel = event.target.value;
    if(zoomLevel > this.canvas.getZoom())
      status = 'in';
    else
      status = 'out';

    var SCALE_FACTOR = 1.2;

    switch(status) {
      case 'in':
      var zoomLevelFactor = this.canvas.getZoom() * SCALE_FACTOR;
      if(zoomLevelFactor<32)
      this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), this.canvas.getZoom() * SCALE_FACTOR);
      break;
      case 'out':
      var zoomLevelFactor = this.canvas.getZoom() * SCALE_FACTOR;
      if(this.canvas.getZoom()> 1)
        this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), this.canvas.getZoom() / SCALE_FACTOR);
      break;
      case 'reset':
      this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), 1);
      break;
      default: 
	  }
  this.canvas.renderAll();
}
  

  get rangeVal() {
    if(this.modalOpenedFor == 'stroke')
      return this.selectedOptions.strokeWidth;
    else if(this.modalOpenedFor == 'shadow')
      return this.selectedOptions.shadowWidth;
    else if(this.modalOpenedFor == 'opacity')
      return this.selectedOptions.opacity;
  }

  mouseWheel(){
    $("body").mousewheel(function (event, delta) {
      var zoomScale = 1.3;
      var mousePageX = event.pageX;
      var mousePageY = event.pageY;
   
      var offset = $("#myCanvas").offset();
      var canvasX = offset.left;
      var canvasY = offset.top;
   
      // Ignore if mouse is not on canvas
      if (mousePageX < canvasX || mousePageY < canvasY || mousePageX > (canvasX + this.canvas.getWidth())
                  || mousePageY > (canvasY + this.canvas.getHeight())) {
          return;
      }
   
      // Ignore if mouse is not on background
      var mouseOffsetX = event.offsetX;
      var mouseOffsetY = event.offsetY;
   
      if (mouseOffsetX < this.canvas.left || mouseOffsetX > this.canvas.left + this.canvas.currentWidth
                  || mouseOffsetY < this.canvas.top || mouseOffsetY > this.canvas.top + this.canvas.currentHeight) {
          return;
      }
   
      var scaleFactor = 1.1;
      var change = (delta > 0) ? scaleFactor : (1 / scaleFactor);
   
      // Limit zooming out
      var newZoomScale = zoomScale * change;
      if (newZoomScale < 1) {
          return;
      }
      zoomScale = newZoomScale;
   
      var backgroundWidthOrig = (this.canvas.width * this.canvas.scaleX);
      var backgroundHeightOrig = (this.canvas.height * this.canvas.scaleY);
   
      // Scale objects
      var objects = this.canvas.getObjects();
      for (var i in objects) {
          var obj = objects[i];
   
          if (obj.zoomScale != undefined) {
              obj.scaleX = obj.zoomScale * zoomScale;
              obj.scaleY = obj.zoomScale * zoomScale;
          }
   
          obj.left = obj.left * change;
          obj.top = obj.top * change;
          obj.setCoords();
      }
   
      var backgroundWidthNew = (this.canvas.width * this.canvas.scaleX);
      var backgroundHeightNew = (this.canvas.height * this.canvas.scaleY);
   
      var backgroundWidthDelta = backgroundWidthNew - backgroundWidthOrig;
      var backgroundHeightDelta = backgroundHeightNew - backgroundHeightOrig;
   
      // Shift objects
      for (var i in objects) {
          var obj = objects[i];
          obj.left -= (backgroundWidthDelta / 2);
          obj.top -= (backgroundHeightDelta / 2);
          obj.setCoords();
      }
   
      this.canvas.renderAll();
   
      event.stopPropagation();
      event.preventDefault();
    });
  }
}

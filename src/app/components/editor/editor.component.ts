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
  toggle : boolean;

  overLayText: any;

  canvas_Width: number;
  canvas_Height: number;

  private closeResult: string;

  modalOpenedFor: string;
  canvasSizes: any = {small : { width: 500, height : 500 },
                              wide  : { width: 450, height : 900 },
                              tall  : { width: 900, height : 450 },
                              large : { width: 900, height : 900 },
                              };

  color: string = "#000";                            
  @ViewChildren('filters') filters : QueryList<any>;


  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.selectedImage = 'assets/images/image-1.jpg';
    this.data = new Data();
    this.toggle = false;
    this.overLayText = '';
    this.selectedOptions =  { filter: 'none', fontStyle: 'normal', fontSize: 32 , fontFamily: 'Helvetica' , fontWeight: 'normal' , textAlign: 'center' , colors: '#000', stroke : '', strokeWidth : 0, canvasSize : 'small' , shadow: 0};
    this.canvas_Width = this.canvasSizes.small.width;
    this.canvas_Height= this.canvasSizes.small.height;
    this.modalOpenedFor = '';
    
   //this.drawWithFabricJS(this.selectedImage);
    
    this.setUpCanvas(this.selectedImage);
  }  


  setUpCanvas(image) {

    this.canvas = new fabric.Canvas('canvas');    
    this.canvas.setHeight(this.canvas_Width);
    this.canvas.setWidth(this.canvas_Height);
    
    fabric.Image.fromURL(image, img => {

      img.scaleToWidth(this.canvas.getWidth());
      
      img.set({
        scaleX :this.canvas.getWidth() / img.width,   //new update
        scaleY: this.canvas.getHeight() / img.height,   //new update,
        selectable: false
      });

      this.canvas.centerObject(img);
      img.setCoords();
      
      if ( Math.max(img.width, img.height) > 2048) {
        let fscale = 2048 / Math.max(img.width, img.height);
        img.filters.push(new fabric.Image.filters.Resize({scaleX: fscale, scaleY: fscale}));
        img.applyFilters();
      }
    
      this.canvas.add(img);

      let text = this.setText();

      text.on("editing:entered",  (e)  => {
        var obj = this.canvas.getActiveObject();
        if(obj.text === 'Enter your text here')
        {
            obj.selectAll();
            obj.text = "";
            obj.fill = this.selectedOptions.colors;
            obj.hiddenTextarea.value = "";
            obj.dirty = true;
            obj.setCoords();
            this.canvas.renderAll();
        }

        else{
          this.overLayText = obj.text;
        }
    });
      this.canvas.add(text);
      this.canvas.centerObject(text);
      this.canvas.setActiveObject(text);
      this.canvas.bringToFront(text);
      
      this.canvas.renderAll();
    
    });
  }

  setText(){
    let text = new fabric.IText(this.overLayText ? this.overLayText : 'Enter your text here', {
      fontSize: this.selectedOptions.fontSize,
      fontFamily: this.selectedOptions.fontFamily,
      fill: "#C0C0C0",
      textAlign: this.selectedOptions.textAlign,
      stroke: this.selectedOptions.stroke,
      strokeWidth: this.selectedOptions.strokeWidth,
    });

     
    
    return text;
  }

  drawWithFabricJS(selectedImage){
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.setDimensions({width:this.canvasWidth, height:this.canvas_Height});
    this.canvas.clear();
    
    fabric.Image.fromURL(selectedImage, (img) => {

      img.scaleToWidth(this.canvas.getWidth());
      img.scaleToHeight(this.canvas.getHeight());
      
      if ( Math.max(img.width, img.height) > 2048) {
        console.log('Greater than 2048.');
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
        textAlign: this.selectedOptions.textAlign,
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
            obj.fill = this.selectedOptions.colors;
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

  get images(): Array<any> {
    return ['assets/images/image-1.jpg', 'assets/images/image-2.jpg' , 'assets/images/image-3.jpg' , 'assets/images/image-4.jpg' , 'assets/images/image-5.jpg']
  }

  
  onAttributeChange(value , attribute){
    switch(attribute){
      case 'canvasSize':
      console.log('Size', value);
      this.selectedOptions.canvasSize = value;
      this.setCanvasSize(value);
      break;
      case 'imageChange':
      this.selectedImage = value;
      break;
      case 'effect':
        this.selectedOptions.effect = value;
      break;
      case 'fontFamily':
      this.selectedOptions.font_family = value;      
      this.canvas.getActiveObject().set("fontFamily", value);
      break;
      case 'fontStyle':
      this.selectedOptions.font_style = value;
      break;
      case 'fontSize':
      this.selectedOptions.font_size =value;
      this.canvas.getActiveObject().set("fontSize", value);
      break;
      case 'fontWeight':
      this.selectedOptions.font_weight = value;
      this.canvas.getActiveObject().set("fontWeight", value);
      break;
      case 'color':
      this.selectedOptions.colors = value;
      this.canvas.getActiveObject().set("fill", `${value}`);
      break;
      case 'shadow':
      this.selectedOptions.text_shadow = this.selectedOptions.text_shadow == 3 ? 0 :value;
      const shadow = `${value}` + ' 3px 3px 3px'
      this.canvas.getActiveObject().set("shadow", shadow);
      break;
      case 'stroke':
      this.canvas.getActiveObject().set('stroke', value);
      this.canvas.getActiveObject().set('strokeWidth' , 2);
      case 'textAlign':
      this.canvas.getActiveObject().set('textAlign', `${value.toLowerCase()}`);
      default:
      break;
    }

    if(attribute == 'canvasSize' || attribute == 'imageChange'){
      this.canvas.clear();
      this.setUpCanvas(this.selectedImage);
    }
    else
      this.canvas.renderAll();
    
  }

  setCanvasSize(size){
    this.canvas_Width = this.canvasSizes[size].width;
    this.canvas_Height= this.canvasSizes[size].height;
  }

  open(content, option) {
    this.modalOpenedFor = option;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log('Close Result', this.selectedOptions);
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
    return this.modalOpenedFor ? this.data[this.modalOpenedFor] : [];
  }

  handlePropertyChange(event){
    if(event.target.checked) {
      this.onAttributeChange(event.target.value , this.modalOpenedFor);
    }
  }

  isString(value){ return typeof value == 'string' ? true : false;}

  isSelected(value){ return this.selectedOptions[this.modalOpenedFor.toLowerCase().replace(' ', '_')] = value ? true : false; }

  get canvasWidth(){
    const canvasArea = this.canvasArea.nativeElement.offsetWidth;
    console.log(this.canvas_Width,canvasArea);
    return ( this.canvas_Width > canvasArea ) ?  canvasArea - 20 : this.canvas_Width;
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

}
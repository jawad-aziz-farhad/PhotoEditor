import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;

  colors: Array<any> = [
    '#FFFFFF',
    '#000000',
    '#e73836',
    '#d91961',
    '#8e24a9',
    '#5f34b0',
    '#3949ac',
    '#3946ad',
    '#1f88e6',
    '#039ae7',
    '#01acc4',
    '#008979',
    '#42a146',
    '#7bb441',
    '#bfca33',
    '#fdd737',
    '#ffb101',
    '#fa8d00',
    '#f6521c',
    '#6f4c43',
    '#777576',
    '#566f7b',
    '#d4d4d4',
    '#acacac',
    '#828282',
    '#4c4c4c'];                      
  @Input() set canvasWidth(width){this._canvasWidth = width; };
  get canvasWidth(){ return this._canvasWidth; }

  @Output()
  color: EventEmitter<any> = new EventEmitter();

  _canvasWidth : number;

  ctx: CanvasRenderingContext2D;
  mousedown: boolean = false;
  selectedHeight: number;
  
  constructor() { }

  ngOnInit() {
    this.canvas.nativeElement.width = 50 * 26 ;
  }

  ngAfterViewInit() {
    //this.draw();

    //this.onMouseDown();

    this._onMouseDown();
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false;
  }
  
  draw() {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
    }    
    const width  = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;
    
    const gradient = this.ctx.createLinearGradient(width, 0, 0, 0);
    for(let i=1; i<this.colors.length;i++){
      gradient.addColorStop(0.04 * i, this.colors[i]);
    }

    this.ctx.beginPath();
    this.ctx.rect(0, 0, width, height);

    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();

    if (this.selectedHeight) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#00D0D3';
      this.ctx.lineWidth = 5;
      this.ctx.rect(this.selectedHeight-5, 0 , 10, height);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  onMouseDown(evt?: MouseEvent) {    
    if(evt){
      this.mousedown = true;
      this.selectedHeight = evt.offsetX;
      this.draw();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
    else{
      this.selectedHeight = this._canvasWidth - 6;
      this.draw();
      this.emitColor(this.selectedHeight, 30 - 7);
    }
    
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.selectedHeight = evt.offsetX;
      this.draw();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
  }

  emitColor(x: number, y: number) {
    const rgbaColor = this.getColorAtPosition(x, y);
    this.color.emit(rgbaColor);
  }  

  getColorAtPosition(x: number, y: number) {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data;
    const rgba = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    const hex  = this.rgba2Hex(rgba);
    return { color: { hex : hex } }; 
  }

  rgba2Hex (rgba) {
    rgba = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgba && rgba.length === 4) ? "#" +
     ("0" + parseInt(rgba[1],10).toString(16)).slice(-2) +
     ("0" + parseInt(rgba[2],10).toString(16)).slice(-2) +
     ("0" + parseInt(rgba[3],10).toString(16)).slice(-2) : '';
  }

  drawOnCanvas() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    const squares = [];
    let points = { width : 30, height : this.canvas.nativeElement.height , x : 0 , y: 10}
    for(let k=0; k<this.colors.length;k++) {
      squares.push(this.drawStuff( points.width, points.height, this.colors[k], points.x, points.y));
      points.x = points.x + points.width;      
    }
    for (let i=0; i<squares.length; i++){
      this.ctx.fillStyle = squares[i].color;
      this.ctx.fillRect(squares[i].left,squares[i].top,squares[i].width,squares[i].height);
    }
  } 
  drawStuff(width, height, color, x, y) {
    let shape : any; 
    shape = {};
    shape.left = x;
    shape.top = y;
    shape.width = width;
    shape.height = height;
    shape.color = color;
    return shape;
  }

  _onMouseDown(evt?: MouseEvent){
    if(evt){
      this.mousedown = true;
      this.selectedHeight = evt.offsetX;
      this.drawOnCanvas();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
    else{
      this.selectedHeight = this._canvasWidth - 6;
      this.drawOnCanvas();
      this.emitColor(this.selectedHeight, 30 - 7);
    }
  }
}

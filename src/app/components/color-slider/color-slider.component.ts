import { Component, ViewChild, ElementRef, AfterViewInit, Output, HostListener, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.sass']
})
export class ColorSliderComponent implements AfterViewInit , OnDestroy {

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
    '#4c4c4c',];

  @Input() set canvasWidth(width){
    this._canvasWidth = width;
  };

  
  @Output()
  color: EventEmitter<any> = new EventEmitter();

  _canvasWidth : number;
  private ctx: CanvasRenderingContext2D;
  private mousedown: boolean = false;
  private selectedHeight: number;

 
  ngAfterViewInit() {
    this.draw();
  }

  ngOnDestroy(){
    this.clearTheCanvas();
  }

  draw() {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
    }
    
    this.clearTheCanvas();

    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;
    
    const gradient = this.ctx.createLinearGradient(width, 0, 0, 0);
    
    // gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    // gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    // gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    // gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    // gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    // gradient.addColorStop(0.78, 'rgba(255, 0, 255, 1)');
    // gradient.addColorStop(0.83, 'rgba(255, 0, 0, 1)');
    // gradient.addColorStop(0.90, 'rgba(255, 255, 255, 1)');
    // gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

    for(let i=1; i<this.colors.length;i++){
      gradient.addColorStop(0.04 * i, this.colors[i]);
    }

    // gradient.addColorStop(0.4, 'rgba(255, 0, 0, 1)');
    // gradient.addColorStop(0.8, 'rgba(255, 255, 0, 1)');
    // gradient.addColorStop(0.3, 'rgba(0, 255, 0, 1)');
    // gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    // gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    // gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    // gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

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

  clearTheCanvas(){
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;
    this.ctx.clearRect(0, 0, width, height);
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false;
  }

  // @HostListener('window:mouseover', ['$event']) onHover(evt: MouseEvent) {
  //   this.mousedown = true;
  //   this.selectedHeight = evt.offsetX;
  //   this.draw();
  //   this.emitColor(evt.offsetX, evt.offsetY);
  // }

  onMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.selectedHeight = evt.offsetX;
    this.draw();
    this.emitColor(evt.offsetX, evt.offsetY);
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
}
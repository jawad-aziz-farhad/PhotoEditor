import { Component, ViewChild, ElementRef, AfterViewInit, Output, HostListener, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.sass']
})
export class ColorSliderComponent implements AfterViewInit {
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;

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

  draw() {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
    }
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    this.ctx.clearRect(0, 0, width, height);

    const gradient = this.ctx.createLinearGradient(width, 0, 0, 0);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.78, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(0.83, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.90, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

    // gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    // gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    // gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
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

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false;
  }

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
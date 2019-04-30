import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.sass']
})
export class TestComponent implements AfterViewInit {

  @ViewChild('visualization') visualization: ElementRef;
  @ViewChild('img') img: ElementRef;

  private context: CanvasRenderingContext2D;
  private element: HTMLImageElement;

  src: string;
  imgWidth: number
  imgHeight: number

  constructor() {
    this.imgWidth = 400;
    this.imgHeight = 400;
    this.src = 'assets/images/image-1.jpg';
  }

  ngAfterViewInit() {
    this.context = this.visualization.nativeElement.getContext("2d");
    this.element = this.img.nativeElement;
  }

  afterLoading() {
    this.context.clearRect(0, 0, this.imgWidth, this.imgHeight);
    this.context.drawImage(this.element, 0, 0, this.imgWidth, this.imgHeight);
  }
}

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.sass']
})
export class TestComponent  {
    
    rotationAmount = 0;

    constructor() {
    }

    get rotateAngle() {
        return this.rotationAmount;
    }

    rotateText(){
        this.rotationAmount = this.rotationAmount >= 180 ? 0 : this.rotationAmount + 45;
        console.log('Roation Amount', this.rotationAmount);
    }
}

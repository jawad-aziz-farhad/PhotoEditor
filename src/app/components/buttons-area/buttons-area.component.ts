import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-buttons-area',
  templateUrl: './buttons-area.component.html',
  styleUrls: ['./buttons-area.component.scss']
})
export class ButtonsAreaComponent implements OnInit {

  _canvas: any;

  @Input('canvas') 
  set in(canvas) { this._canvas = canvas; }
  get canvas(){ return this._canvas; }

  constructor() { }

  ngOnInit() {
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

  dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
     bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

}

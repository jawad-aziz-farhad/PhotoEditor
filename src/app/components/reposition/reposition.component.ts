import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reposition',
  templateUrl: './reposition.component.html',
  styleUrls: ['./reposition.component.sass']
})
export class RepositionComponent implements OnInit {

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  _onClick(action){
    this.onClick.emit({action: action});
  }

}

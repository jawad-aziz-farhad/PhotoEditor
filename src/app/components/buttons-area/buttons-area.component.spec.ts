import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsAreaComponent } from './buttons-area.component';

describe('ButtonsAreaComponent', () => {
  let component: ButtonsAreaComponent;
  let fixture: ComponentFixture<ButtonsAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonsAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

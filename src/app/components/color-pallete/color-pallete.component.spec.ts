import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPalleteComponent } from './color-pallete.component';

describe('ColorPalleteComponent', () => {
  let component: ColorPalleteComponent;
  let fixture: ComponentFixture<ColorPalleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPalleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPalleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextModifiersComponent } from './text-modifiers.component';

describe('TextModifiersComponent', () => {
  let component: TextModifiersComponent;
  let fixture: ComponentFixture<TextModifiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextModifiersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextModifiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

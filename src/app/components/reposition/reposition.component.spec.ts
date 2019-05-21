import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositionComponent } from './reposition.component';

describe('RepositionComponent', () => {
  let component: RepositionComponent;
  let fixture: ComponentFixture<RepositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

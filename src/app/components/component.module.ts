import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { EditorComponent } from './editor/editor.component';
import { ColorSliderComponent } from './color-slider/color-slider.component';
import { RepositionComponent } from './reposition/reposition.component';
import { NewEditorComponent } from './new-editor/new-editor.component';

@NgModule({
    declarations: [NavbarComponent, HomeComponent , TestComponent, EditorComponent, ColorSliderComponent , RepositionComponent, NewEditorComponent
    ],
    imports: [
      BrowserModule,
      AngularDraggableModule,
      NgbModule,
      FormsModule
    ],
    exports: [ NavbarComponent , HomeComponent , TestComponent , RepositionComponent], 
    providers: [],
    bootstrap: []
  })

export class ComponentsModule { }
import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { EditorComponent } from './editor/editor.component';
import { RepositionComponent } from './reposition/reposition.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TextModifiersComponent } from './text-modifiers/text-modifiers.component';
import { ShapesComponent } from './shapes/shapes.component';
import { FiltersComponent } from './filters/filters.component';
import { CanvasSizeComponent } from './canvas-size/canvas-size.component';
import { ButtonsAreaComponent } from './buttons-area/buttons-area.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@NgModule({
    declarations: [NavbarComponent, HomeComponent , EditorComponent,  RepositionComponent, TextModifiersComponent, ShapesComponent, FiltersComponent, CanvasSizeComponent, ButtonsAreaComponent, ColorPickerComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      BsDropdownModule.forRoot()
    ],
    exports: [ NavbarComponent , HomeComponent , RepositionComponent , TextModifiersComponent], 
    providers: [],
    bootstrap: []
  })

export class ComponentsModule { }
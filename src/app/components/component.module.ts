import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { EditorComponent } from './editor/editor.component';
import { ColorSliderComponent } from './color-slider/color-slider.component';
import { RepositionComponent } from './reposition/reposition.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TextModifiersComponent } from './text-modifiers/text-modifiers.component';

@NgModule({
    declarations: [NavbarComponent, HomeComponent , EditorComponent, ColorSliderComponent , RepositionComponent, TextModifiersComponent
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
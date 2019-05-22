import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { EditorComponent } from './editor/editor.component';
import { ColorSliderComponent } from './color-slider/color-slider.component';
import { RepositionComponent } from './reposition/reposition.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
    declarations: [NavbarComponent, HomeComponent , TestComponent, EditorComponent, ColorSliderComponent , RepositionComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      BsDropdownModule.forRoot()
    ],
    exports: [ NavbarComponent , HomeComponent , TestComponent , RepositionComponent], 
    providers: [],
    bootstrap: []
  })

export class ComponentsModule { }
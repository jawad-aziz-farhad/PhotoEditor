import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { EditorComponent } from './editor/editor.component';

@NgModule({
    declarations: [NavbarComponent, HomeComponent , TestComponent, EditorComponent
    ],
    imports: [
      BrowserModule,
      AngularDraggableModule
    ],
    exports: [ NavbarComponent , HomeComponent , TestComponent ], 
    providers: [],
    bootstrap: []
  })

export class ComponentsModule { }
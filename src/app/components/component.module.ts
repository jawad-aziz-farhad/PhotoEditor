import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { AngularDraggableModule } from 'angular2-draggable';

@NgModule({
    declarations: [NavbarComponent, HomeComponent , TestComponent
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
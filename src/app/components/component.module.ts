import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';

@NgModule({
    declarations: [NavbarComponent, HomeComponent , TestComponent
    ],
    imports: [
      BrowserModule
    ],
    exports: [ NavbarComponent , HomeComponent , TestComponent ], 
    providers: [],
    bootstrap: []
  })

export class ComponentsModule { }
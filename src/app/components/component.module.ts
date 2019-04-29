import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [NavbarComponent, HomeComponent
    ],
    imports: [
      BrowserModule
    ],
    exports: [ NavbarComponent , HomeComponent ], 
    providers: [],
    bootstrap: []
  })

export class ComponentsModule { }
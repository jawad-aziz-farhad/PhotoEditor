import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TextpositionerDirective } from './textpositioner/textpositioner.directive';

@NgModule({
    declarations: [ TextpositionerDirective ],
    imports: [
      BrowserModule
    ],
    exports: [ TextpositionerDirective ], 
    providers: [],
    bootstrap: []
  })

export class DirectivesModule { }
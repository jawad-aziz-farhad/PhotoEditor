import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TestComponent } from './components/test/test.component';
import { EditorComponent } from './components/editor/editor.component';
import { NewEditorComponent } from './components/new-editor/new-editor.component';

const routes: Routes = [ 
  { path: '', component: NewEditorComponent },
  { path: 'home', component: HomeComponent },
  { path: 'test', component: TestComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

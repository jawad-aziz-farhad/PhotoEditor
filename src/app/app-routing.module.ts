import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TestComponent } from './components/test/test.component';
import { EditorComponent } from './components/editor/editor.component';

const routes: Routes = [ 
  { path: '', component: EditorComponent },
  { path: 'home', component: HomeComponent },
  { path: 'test', component: TestComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeOverViewComponent } from './over-view/over-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'over-view', pathMatch: 'full' },
  { path: 'over-view', component: HomeOverViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

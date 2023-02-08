import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewStatisticsPage } from './view-statistics.page';

const routes: Routes = [
  {
    path: '',
    component: ViewStatisticsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewStatisticsPageRoutingModule {}

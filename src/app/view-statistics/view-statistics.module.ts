import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewStatisticsPageRoutingModule } from './view-statistics-routing.module';

import { ViewStatisticsPage } from './view-statistics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewStatisticsPageRoutingModule
  ],
  declarations: [ViewStatisticsPage]
})
export class ViewStatisticsPageModule {}

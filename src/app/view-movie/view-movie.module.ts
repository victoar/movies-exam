import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewMoviePage } from './view-movie.page';

import { IonicModule } from '@ionic/angular';

import { ViewMessagePageRoutingModule } from './view-movie-routing.module';
import {MovieComponent} from "../movie/movie.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewMessagePageRoutingModule
  ],
  declarations: [ViewMoviePage, MovieComponent]
})
export class ViewMessagePageModule {}

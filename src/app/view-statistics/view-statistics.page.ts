import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {WebsocketService} from "../websocket.service";
import {AlertController, LoadingController, ModalController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {DbService} from "../db.service";
import {NetworkService} from "../network.service";
import {bagCheck} from "ionicons/icons";

@Component({
  selector: 'app-view-statistics',
  templateUrl: './view-statistics.page.html',
  styleUrls: ['./view-statistics.page.scss'],
})
export class ViewStatisticsPage implements OnInit {
  firstButtonSelected: boolean = false;
  secondButtonSelected: boolean = false;
  elements: any[] | undefined;
  filterByYearElems: any[] | undefined;
  topThreeByGenre: any[] | undefined;

  constructor(private apiService: ApiService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private modalController: ModalController,
              private activatedRoute: ActivatedRoute,
              private dbService: DbService,
              private networkService: NetworkService) { }

  ngOnInit() {
    this.loadElements();
    this.firstButtonAction();
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inbox' : '';
  }

  firstButtonAction() {
    this.firstButtonSelected = true;
    this.secondButtonSelected = false;
    this.elements = this.filterByYearElems;
  }

  secondButtonAction() {
    this.secondButtonSelected = true;
    this.firstButtonSelected = false;
    this.elements = this.topThreeByGenre;
  }

  loadElements() {
    this.simpleLoader();
    this.getAllElements();
    this.dismissLoader();
  }

  getAllElements() {
    const elems: any[] | undefined = [];

    this.apiService.getAllElements().subscribe((returnedElems) => {
      // @ts-ignore
      for(const item of returnedElems) {
        const elem = {
          id: item.id,
          name: item.name,
          description: item.description,
          genre: item.genre,
          director: item.director,
          year: item.year
        }
        elems.push(elem);
      }
      this.filterMethod(elems);
    })
  }

  simpleLoader() {
    this.loadingController.create({
      duration: 700,
      message: 'Loading...'
    }).then((response) => {
      response.present();
    });
  }

  dismissLoader() {
    this.loadingController.dismiss().then((response) => {
      console.log('Loader closed!', response);
    }).catch(() => {
      console.log();
    });
  }

  private filterMethod(elems: any[]) {
    let years: any[] = [];
    let genres: any[] = []
    for(const item of elems) {
      if(!years.find(year => year.year == item.year)) {
        const elem = {
          year: item.year,
          count: elems.filter(m => m.year == item.year).length
        }
        years.push(elem);
      }
      if(!genres.find(genre => genre.genre == item.genre)) {
        const elem = {
          genre: item.genre,
          count: elems.filter(m => m.genre == item.genre).length
        }
        genres.push(elem);
      }
    }
    this.filterByYearElems = years.sort((a, b) => {
      if (a.count === b.count) {
        if (a.year < b.year) return 1;
        if (a.year > b.year) return -1;
        return 0;
      }
      if (a.count < b.count) return 1;
      if (a.count > b.count) return -1;
      return 0;
    });
    this.topThreeByGenre = genres.sort((a, b) => {
      if (a.count === b.count) {
        if (a.genre.toLowerCase() < b.genre.toLowerCase()) return -1;
        if (a.genre.toLowerCase() > b.genre.toLowerCase()) return 1;
        return 0;
      }
      if (a.count < b.count) return 1;
      if (a.count > b.count) return -1;
      return 0;
    });
  }

}

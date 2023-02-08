import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, Message } from '../services/data.service';
import {ApiService} from "../api.service";
import {WebsocketService} from "../websocket.service";
import {AlertController, LoadingController, ModalController} from "@ionic/angular";
import {DbService} from "../db.service";
import {NetworkService} from "../network.service";

@Component({
  selector: 'app-view-message',
  templateUrl: './view-movie.page.html',
  styleUrls: ['./view-movie.page.scss'],
  providers: [WebsocketService]
})
export class ViewMoviePage implements OnInit {
  public genre: string;
  public elements: any[] | undefined;

  constructor(
    private apiService: ApiService,
    private webSocketService: WebsocketService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private dbService: DbService,
    private networkService: NetworkService
  ) {
  }

  ngOnInit() {
    this.genre = this.activatedRoute.snapshot.paramMap.get('genre') as string;
    console.log(this.genre);
    this.loadElements();
    this.webSocketService.messages.subscribe(() => {
      this.getAllElements();
    })
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inbox' : '';
  }

  getAllElements() {
    const elems: any[] | undefined = [];

    this.networkService.getNetworkStatus().then(async (status) => {
      if(status['connected']) {
        this.apiService.getMoviesElements(this.genre).subscribe((returnedElems) => {
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
          this.elements = elems;
          console.log(this.elements);
          this.dbService.setElements(this.elements).then(() => console.log("Local DB refreshed successfully!"));
        }, error => {
          this.showAlert(error);
        })
      } else {
        this.showAlert("You are offline!\n Check your internet connection and refresh page!");
        this.elements = this.dbService.getAllElements();
      }
    })
  }

  loadElements() {
    this.simpleLoader();
    this.getAllElements();
    this.dismissLoader();
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

  showAlert(message: string) {
    this.alertController.create({
      header: 'Info',
      message: message,
      buttons: ['OK']
    }).then(res => {
      res.present();
    });
  }
}

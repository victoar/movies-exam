import { Component } from '@angular/core';
import {AlertController, LoadingController, RefresherCustomEvent, ToastController} from '@ionic/angular';

import { DataService, Message } from '../services/data.service';
import {ApiService} from "../api.service";
import {WebsocketService} from "../websocket.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [WebsocketService]
})
export class HomePage {
  elements: any[] | undefined;

  constructor(private apiService: ApiService,
              private webSocketService: WebsocketService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private toastController: ToastController) {
  }

  ngOnInit() {
    this.loadElements();
    this.webSocketService.messages.subscribe((msg) => {
      this.showToast(msg);
      this.getAllElements();
    })
    this.apiService.reload.subscribe(() => {
      this.getAllElements();
    })
  }

  getAllElements() {
    const elems: any[] | undefined = [];

    this.apiService.getAllGenresElements().subscribe((returnedElems) => {
      // @ts-ignore
      console.log(returnedElems);
      // @ts-ignore
      for(const item of returnedElems) {
        elems.push(item);
      }
    })
    this.elements = elems;
    console.log(this.elements);
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

  async showToast(message: any) {
    const toast = await this.toastController.create({
      message: `<p>A new movie has been added to DB!</p><p>Name: ${message.name}</p><p>Description: ${message.description}</p>
      <p>Genre: ${message.genre}</p><p>Director: ${message.director}</p><p>Year: ${message.year}</p>`,
      duration: 4000,
      position: 'top'
    });

    await toast.present();
  }
}

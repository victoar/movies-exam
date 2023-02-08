import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {AlertController, LoadingController} from "@ionic/angular";
import {NetworkService} from "../network.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.page.html',
  styleUrls: ['./add-movie.page.scss'],
})
export class AddMoviePage implements OnInit {
  public name: string | undefined;
  public description: string | undefined;
  public genre: string | undefined;
  public director: string | undefined;
  public year: string | undefined;
  public element: any | undefined;
  public invalidDataError: boolean = false

  constructor(private apiService: ApiService,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private networkService: NetworkService,
              private router: Router) { }

  ngOnInit() {
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inbox' : '';
  }

  onSaveButtonPressed() {
    this.invalidDataError = this.name == '' || this.description == '' || this.genre == '' || this.director == '' ||
      this.year == '';

    if(this.invalidDataError)
      return;

    this.element = ({
      name: this.name,
      description: this.description,
      director: this.director,
      genre: this.genre,
      year: parseInt(this.year)
    })

    this.networkService.getNetworkStatus().then(async (status) => {
      if(status['connected']) {
        this.simpleLoader();
        this.apiService.addElement(this.element).subscribe({
          complete: () => {
            this.dismissLoader();
            this.showAlert('New element inserted successfully!', true);
          },
          error: () => {
            this.showAlert('The element could not be inserted into db!', false);
          }
        })
      } else {
        this.showAlert('Connection is offline!', false);
      }
    })
  }

  showAlert(message: string, goHome: boolean) {
    this.alertController.create({
      header: 'Info',
      message: message,
      buttons: [{
        text: 'OK',
        handler: () => {
          if(goHome) {
            this.dismissLoader();
            this.router.navigate(['/']);
          }
        }
      }]
    }).then(res => {
      res.present();
    });
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
}

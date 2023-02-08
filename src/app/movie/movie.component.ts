import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {AlertController, LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit {
  @Input()
  public movie: any;

  constructor(private apiService: ApiService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private router: Router) { }

  ngOnInit() {}

  async deleteElem(id: string) {
    this.alertController.create({
      message: 'Are you sure you want to delete it?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.simpleLoader();
            this.apiService.deleteElement(id).subscribe({
              error: (error) => {
                const message = error.erro?.error ?? 'Unknown server error';
                console.log(message);
              }
            })
            this.dismissLoader();
            this.apiService.reloadElements();
            this.router.navigate(['/'])
          }
        }
      ]
    }).then(response => {
      response.present();
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

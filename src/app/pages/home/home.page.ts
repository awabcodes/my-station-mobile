import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, Platform } from '@ionic/angular';
import { AccountService } from 'src/app/services/auth/account.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Account } from 'src/model/account.model';
import { Station, StationService } from '../entities/station';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  account: Account;

  stations: Station[];

  isShowFilters: boolean;

  public searchControl: FormControl;
  city: string;
  searchTerm: string;
  gasLevel: number;
  benLevel: number;

  constructor(
    public navController: NavController,
    private accountService: AccountService,
    private loginService: LoginService,
    private stationService: StationService,
    private toastCtrl: ToastController,
    private iab: InAppBrowser,
    public plt: Platform
  ) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.accountService.identity().then(account => {
      if (account === null) {
        this.goBackToHomePage();
      } else {
        this.account = account;
      }
    });

    this.loadAll();

    this.searchControl.valueChanges
      .subscribe(search => {
        this.searchTerm = search;
        this.loadAll();
      });
  }

  async loadAll(refresher?) {
    this.stationService.query({
      size: 9000000,
      'name.contains': this.searchTerm ? this.searchTerm : '',
      'city.contains': this.city ? this.city : '',
      'gasLevel.greaterThanOrEqual': this.gasLevel ? this.gasLevel : '',
      'benzeneLevel.greaterThanOrEqual': this.benLevel ? this.benLevel : ''
    }).pipe(
      filter((res: HttpResponse<Station[]>) => res.ok),
      map((res: HttpResponse<Station[]>) => res.body)
    )
      .subscribe(
        (response: Station[]) => {
          this.stations = response;
          if (typeof (refresher) !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          toast.present();
        });
  }

  trackId(index: number, item: Station) {
    return item.id;
  }

  view(station: Station) {
    const browser = this.iab.create(station.mapUrl, '_system');
  }

  toggleFilters() {
    this.isShowFilters = !this.isShowFilters;
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  logout() {
    this.loginService.logout();
    this.goBackToHomePage();
  }

  private goBackToHomePage(): void {
    this.navController.navigateBack('');
  }
}

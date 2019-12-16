import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Station } from './station.model';
import { StationService } from './station.service';

@Component({
    selector: 'page-station',
    templateUrl: 'station.html'
})
export class StationPage {
    stations: Station[];

    // todo: add pagination

    constructor(
        private navController: NavController,
        private stationService: StationService,
        private toastCtrl: ToastController,
        public plt: Platform
    ) {
        this.stations = [];
    }

    ionViewWillEnter() {
        this.loadAll();
    }

    async loadAll(refresher?) {
        this.stationService.query().pipe(
            filter((res: HttpResponse<Station[]>) => res.ok),
            map((res: HttpResponse<Station[]>) => res.body)
        )
        .subscribe(
            (response: Station[]) => {
                this.stations = response;
                if (typeof(refresher) !== 'undefined') {
                    setTimeout(() => {
                        refresher.target.complete();
                    }, 750);
                }
            },
            async (error) => {
                console.error(error);
                const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
                toast.present();
            });
    }

    trackId(index: number, item: Station) {
        return item.id;
    }

    new() {
        this.navController.navigateForward('/tabs/entities/station/new');
    }

    edit(item: IonItemSliding, station: Station) {
        this.navController.navigateForward('/tabs/entities/station/' + station.id + '/edit');
        item.close();
    }

    async delete(station) {
        this.stationService.delete(station.id).subscribe(async () => {
            const toast = await this.toastCtrl.create(
                {message: 'Station deleted successfully.', duration: 3000, position: 'middle'});
            toast.present();
            this.loadAll();
        }, (error) => console.error(error));
    }

    view(station: Station) {
        this.navController.navigateForward('/tabs/entities/station/' + station.id + '/view');
    }
}

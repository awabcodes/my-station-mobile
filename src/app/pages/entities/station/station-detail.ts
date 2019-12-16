import { Component, OnInit } from '@angular/core';
import { Station } from './station.model';
import { StationService } from './station.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'page-station-detail',
    templateUrl: 'station-detail.html'
})
export class StationDetailPage implements OnInit {
    station: Station = {};

    constructor(
        private navController: NavController,
        private stationService: StationService,
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController
    ) { }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((response) => {
            this.station = response.data;
        });
    }

    open(item: Station) {
        this.navController.navigateForward('/tabs/entities/station/' + item.id + '/edit');
    }

    async deleteModal(item: Station) {
        const alert = await this.alertController.create({
            header: 'Confirm the deletion?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Delete',
                    handler: () => {
                        this.stationService.delete(item.id).subscribe(() => {
                            this.navController.navigateForward('/tabs/entities/station');
                        });
                    }
                }
            ]
        });
        await alert.present();
    }


}

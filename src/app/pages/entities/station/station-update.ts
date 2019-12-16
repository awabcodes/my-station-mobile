import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Station } from './station.model';
import { StationService } from './station.service';

@Component({
    selector: 'page-station-update',
    templateUrl: 'station-update.html'
})
export class StationUpdatePage implements OnInit {

    station: Station;
    lastTankFill: string;
    isSaving = false;
    isNew = true;
    isReadyToSave: boolean;

    form = this.formBuilder.group({
        id: [],
        name: [null, [Validators.required]],
        gasLevel: [null, [Validators.required]],
        benzeneLevel: [null, [Validators.required]],
        lastTankFill: [null, [Validators.required]],
        city: [null, [Validators.required]],
        location: [null, [Validators.required]],
        mapUrl: [null, [Validators.required]],
    });

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected navController: NavController,
        protected formBuilder: FormBuilder,
        public platform: Platform,
        protected toastCtrl: ToastController,
        private stationService: StationService
    ) {

        // Watch the form for changes, and
        this.form.valueChanges.subscribe((v) => {
            this.isReadyToSave = this.form.valid;
        });

    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((response) => {
            this.updateForm(response.data);
            this.station = response.data;
            this.isNew = this.station.id === null || this.station.id === undefined;
        });
    }

    updateForm(station: Station) {
        this.form.patchValue({
            id: station.id,
            name: station.name,
            gasLevel: station.gasLevel,
            benzeneLevel: station.benzeneLevel,
            lastTankFill: (this.isNew) ? new Date().toISOString() : station.lastTankFill,
            city: station.city,
            location: station.location,
            mapUrl: station.mapUrl,
        });
    }

    save() {
        this.isSaving = true;
        const station = this.createFromForm();
        if (!this.isNew) {
            this.subscribeToSaveResponse(this.stationService.update(station));
        } else {
            this.subscribeToSaveResponse(this.stationService.create(station));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<Station>>) {
        result.subscribe((res: HttpResponse<Station>) => this.onSaveSuccess(res), (res: HttpErrorResponse) => this.onError(res.error));
    }

    async onSaveSuccess(response) {
        let action = 'updated';
        if (response.status === 201) {
          action = 'created';
        }
        this.isSaving = false;
        const toast = await this.toastCtrl.create({message: `Station ${action} successfully.`, duration: 2000, position: 'middle'});
        toast.present();
        this.navController.navigateBack('/tabs/entities/station');
    }

    previousState() {
        window.history.back();
    }

    async onError(error) {
        this.isSaving = false;
        console.error(error);
        const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
        toast.present();
    }

    private createFromForm(): Station {
        return {
            ...new Station(),
            id: this.form.get(['id']).value,
            name: this.form.get(['name']).value,
            gasLevel: this.form.get(['gasLevel']).value,
            benzeneLevel: this.form.get(['benzeneLevel']).value,
            lastTankFill: new Date(this.form.get(['lastTankFill']).value),
            city: this.form.get(['city']).value,
            location: this.form.get(['location']).value,
            mapUrl: this.form.get(['mapUrl']).value,
        };
    }

}

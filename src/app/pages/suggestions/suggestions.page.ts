import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Platform, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.page.html',
  styleUrls: ['./suggestions.page.scss'],
})
export class SuggestionsPage implements OnInit {

  userComment: any;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    title: [null, [Validators.required]],
    message: [null, [Validators.required]],
    date: [null]
  });

  constructor(
    public platform: Platform,
    protected formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private apiService: ApiService
  ) {

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
  }

  save() {
    this.isSaving = true;
    const userComment = this.createFromForm();
    this.subscribeToSaveResponse(this.apiService.post('suggestions', userComment));
  }

  protected subscribeToSaveResponse(result: Observable<any>) {
    result.subscribe((res: HttpResponse<any>) => this.onSaveSuccess(res), (res: HttpErrorResponse) => this.onError(res.error));
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: 'Sent Successfully', duration: 2000, position: 'middle' });
    toast.present();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to send', duration: 2000, position: 'middle' });
    toast.present();
  }

  private createFromForm() {
    return {
      title: this.form.get(['title']).value,
      message: this.form.get(['message']).value,
      date: new Date()
    };
  }

}

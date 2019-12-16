import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Station } from './station.model';

@Injectable({ providedIn: 'root'})
export class StationService {
    private resourceUrl = ApiService.API_URL + '/stations';

    constructor(protected http: HttpClient) { }

    create(station: Station): Observable<HttpResponse<Station>> {
        return this.http.post<Station>(this.resourceUrl, station, { observe: 'response'});
    }

    update(station: Station): Observable<HttpResponse<Station>> {
        return this.http.put(this.resourceUrl, station, { observe: 'response'});
    }

    find(id: number): Observable<HttpResponse<Station>> {
        return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    query(req?: any): Observable<HttpResponse<Station[]>> {
        const options = createRequestOption(req);
        return this.http.get<Station[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }
}

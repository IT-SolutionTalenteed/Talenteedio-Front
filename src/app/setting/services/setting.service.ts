import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Setting } from 'src/app/shared/models/setting.interface';
import { EMPTY_SETTING_2 } from '../constants/setting.constant';
import { SettingServiceInterface } from './setting-service.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingService implements SettingServiceInterface {

  constructor(private http: HttpClient) { }

    loadSetting(): Observable<Setting> {
        // return this.http
        //     .get(`${environment.apiBaseUrl}/${SETTING_API_ROUTE}`)
        //     .pipe(map((response: ApiResponse) => response.data as Setting));
        return of(EMPTY_SETTING_2).pipe(delay(400));
    }

  saveSetting(setting: Setting): Observable<Setting> {
        // return this.http
        //         .put(`${environment.apiBaseUrl}/${SETTING_API_ROUTE}/${setting}`, setting)
        //         .pipe(map((response: ApiResponse) => response.data as Setting));
        return of(setting);
    }
}

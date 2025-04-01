import { Observable } from 'rxjs';
import { Setting } from 'src/app/shared/models/setting.interface';

export interface SettingServiceInterface {
  loadSetting(): Observable<Setting>;
  // settingFactory(): Observable<Setting>;
  // deleteSetting(setting: Setting): Observable<void>;
  saveSetting(setting: Setting): Observable<Setting>;
}

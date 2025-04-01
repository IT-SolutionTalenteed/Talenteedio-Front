import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Setting } from 'src/app/shared/models/setting.interface';
import { saveSetting } from '../../store/actions/setting.actions';
import { SettingState } from '../../store/reducers/setting.reducers';
import { getSaveSettingError, getSetting, getSettingFormLoading } from '../../store/selectors/setting.selectors';

@Component({
  selector: 'app-setting-root',
  templateUrl: './setting-root.component.html',
  styleUrls: ['./setting-root.component.scss']
})
export class SettingRootComponent implements OnInit{
    setting$: Observable<Setting>;
    loading$: Observable<boolean>;
    saveSettingError$: Observable<Error>;

    constructor(private settingStore: Store<SettingState>) {}

    ngOnInit(): void {
        this.setting$ = this.settingStore.pipe(select(getSetting));
        this.loading$ = this.settingStore.pipe(select(getSettingFormLoading));
        this.saveSettingError$ = this.settingStore.pipe(select(getSaveSettingError));
    }

    onSave(setting: Setting) {
        this.settingStore.dispatch(saveSetting({ payload: setting }));
    }
}

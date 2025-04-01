import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { SettingFormComponent } from './components/setting-form/setting-form.component';
import { SettingRootComponent } from './containers/setting-root/setting-root.component';
import { SettingService } from './services/setting.service';
import { SettingRoutingModule } from './setting-routing.module';
import { SettingRouterEffects } from './store/effects/setting-router.effects';
import { SettingEffects } from './store/effects/setting.effects';
import { settingReducer } from './store/reducers/setting.reducers';


@NgModule({
  declarations: [
    SettingRootComponent,
    SettingFormComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    SharedModule,
    NgSelectModule,
    ReactiveFormsModule,
    StoreModule.forFeature('setting', settingReducer),
    EffectsModule.forFeature([SettingEffects, SettingRouterEffects]),
  ],
  providers: [
    {
        provide: SettingService,
        useClass: SettingService,
    },
],
})
export class SettingModule { }

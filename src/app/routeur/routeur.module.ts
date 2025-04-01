import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import {
  RouterStateSerializer,
  StoreRouterConnectingModule,
} from '@ngrx/router-store';
import { RouterEffects } from './store/effects/router.effects';
import { CustomRouterStateSerializer } from './store/reducers/router.reducers';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forRoot([RouterEffects]),
    StoreRouterConnectingModule.forRoot(),
  ],
  declarations: [],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
  ],
})
export class RouteurModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: RouteurModule
  ) {
    this.throwIfAlreadyLoaded(parentModule, 'RouteurModule');
  }

  private throwIfAlreadyLoaded(
    parentModule: RouteurModule,
    moduleName: string
  ) {
    if (parentModule) {
      throw new Error(
        `${moduleName} has already been loaded. Import Core modules in the AppModule only.`
      );
    }
  }
}

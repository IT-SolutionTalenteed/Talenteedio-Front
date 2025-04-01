import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxCaptchaModule } from 'ngx-captcha-ssr';
import { SharedModule } from '../shared/shared.module';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactUpperBoxComponent } from './components/contact-upper-box/contact-upper-box.component';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactRootComponent } from './containers/contact-root/contact-root.component';
import { EmailService } from './services/email.service';
import { ContactEffects } from './store/effects/contact.effects';
import { contactReducer } from './store/reducers/contact.reducers';

@NgModule({
  declarations: [
    ContactRootComponent,
    ContactUpperBoxComponent,
    ContactFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContactRoutingModule,
    SharedModule,
    StoreModule.forFeature('contact', contactReducer),
    EffectsModule.forFeature([ContactEffects]),
    NgxCaptchaModule,
  ],
  providers: [EmailService],
})
export class ContactModule {}

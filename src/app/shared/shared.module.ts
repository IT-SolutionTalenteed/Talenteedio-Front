import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RoleService } from '../role/services/role.service';
import { AutoUpdateStatusComponent } from './components/auto-update-status/auto-update-status.component';
import { ProfilePictureUploadComponent } from './components/profile-picture-upload/profile-picture-upload.component';
import { ChipsComponent } from './components/chips/chips.component';
import { CollapsibleChipsComponent } from './components/collapsible-chips/collapsible-chips.component';
import { FaqAccordionComponent } from './components/faq-accordion/faq-accordion.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { ListBoxFilterComponent } from './components/list-box-filter/list-box-filter.component';
import { ListBoxComponent } from './components/list-box/list-box.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ModalComponent } from './components/modal/modal.component';
import { NavbarMenuComponent } from './components/navbar-menu/navbar-menu.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PeriodFilterComponent } from './components/period-filter/period-filter.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SortableColumnComponent } from './components/sortable-column/sortable-column.component';
import { SortableTableComponent } from './components/sortable-table/sortable-table.component';
import { SwitchComponent } from './components/switch/switch.component';
import { ValidationErrorComponent } from './components/validation-error/validation-error.component';
import { OverflowTooltipDirective } from './directives/overflow-tooltip.directive';
import { ThousandSeparatorDirective } from './directives/thousand-separator.directive';
import { CastPipe } from './pipes/cast.pipe';
import { ClientTypePipe } from './pipes/client-type.pipe';
import { HtmlParserPipePipe } from './pipes/html-parser-pipe.pipe';
import { JoinedListPipe } from './pipes/joined-list.pipe';
import { MonthLabelPipe } from './pipes/month-label.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TranslatePipe } from './pipes/translate.pipe';
import { ValidityNbDayPipe } from './pipes/validity-nb-day.pipe';
import { AdService } from './services/ad.service';
import { LocationService } from './services/location.service';
import { RoleAutocompletionService } from './services/role-autocompletion.service';
import { SettingService } from './services/setting.service';
import { SharedEffects } from './store/effects/shared.effects';
import { sharedReducer } from './store/reducers/shared.reducers';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('shared', sharedReducer),
    EffectsModule.forFeature([SharedEffects]),
    RouterModule,
    ReactiveFormsModule,
    NgSelectModule,
    FontAwesomeModule,
  ],
  declarations: [
    LoaderComponent,
    PaginationComponent,
    ValidationErrorComponent,
    ChipsComponent,
    CollapsibleChipsComponent,
    FaqAccordionComponent,
    ListBoxComponent,
    ListBoxFilterComponent,
    SearchBarComponent,
    InputNumberComponent,
    SortableTableComponent,
    SortableColumnComponent,
    AutoUpdateStatusComponent,
    OverflowTooltipDirective,
    NavbarMenuComponent,
    SwitchComponent,
    CastPipe,
    TranslatePipe,
    PeriodFilterComponent,
    JoinedListPipe,
    ClientTypePipe,
    ValidityNbDayPipe,
    MonthLabelPipe,
    ThousandSeparatorDirective,
    HtmlParserPipePipe,
    ModalComponent,
    SafePipe,
    TimeAgoPipe,
    ProfilePictureUploadComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    LoaderComponent,
    PaginationComponent,
    ValidationErrorComponent,
    ChipsComponent,
    CollapsibleChipsComponent,
    FaqAccordionComponent,
    ListBoxComponent,
    ListBoxFilterComponent,
    SearchBarComponent,
    InputNumberComponent,
    SortableTableComponent,
    SortableColumnComponent,
    AutoUpdateStatusComponent,
    NavbarMenuComponent,
    OverflowTooltipDirective,
    SwitchComponent,
    CastPipe,
    TranslatePipe,
    PeriodFilterComponent,
    JoinedListPipe,
    ClientTypePipe,
    ValidityNbDayPipe,
    MonthLabelPipe,
    ThousandSeparatorDirective,
    NgSelectModule,
    HtmlParserPipePipe,
    ModalComponent,
    SafePipe,
    TimeAgoPipe,
    ProfilePictureUploadComponent,
  ],
  providers: [
    RoleAutocompletionService,
    RoleService,
    LocationService,
    SettingService,
    AdService,
  ],
})
export class SharedModule {}

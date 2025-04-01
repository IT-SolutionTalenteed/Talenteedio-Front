/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() placeholder = 'Rechercher';
  @Input() set initialValue(searchTerm: string) {
    this.searchTerm = searchTerm;
  }

  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  search$ = new Subject<string>();

  searchTerm: string;
  private subs = new SubSink();

  ngOnInit() {
    this.subs.sink = this.search$.pipe(debounceTime(400)).subscribe((s) => {
      this.search.emit(this.searchTerm.trim());
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onChange() {
    this.search$.next('');
  }

  clear() {
    this.searchTerm = '';
    this.onChange();
  }
}

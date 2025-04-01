/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { cloneDeep } from 'lodash';
import {
  FilterItem,
  FilterUpdates,
  ListBoxFilter,
} from '../../types/filter-updates.interface';
import { Chips } from '../collapsible-chips/collapsible-chips.component';

@Component({
  selector: 'app-list-box-filter',
  templateUrl: './list-box-filter.component.html',
  styleUrls: ['./list-box-filter.component.scss'],
})
export class ListBoxFilterComponent implements OnChanges {
  @Input() filterUpdates: FilterUpdates;
  @Input() filterCategoryLabels: Record<string, string>;
  @Input() filterItemLabels: Record<string, Record<string, string>>;
  @Output() filter: EventEmitter<ListBoxFilter> =
    new EventEmitter<ListBoxFilter>();
  @Input() defaultFilters: string[];
  @Input() initialFilterValue: ListBoxFilter;
  @Input() totalItems: number;

  chips: Chips[] = [];
  innactiveFilters: string[];
  ngSelectModel = null;
  private filterValue: ListBoxFilter = {};

  ngOnChanges(changes: SimpleChanges) {
    if (this.firstNotNullInitialFilterValue(changes)) {
      const currentFilterValue: ListBoxFilter =
        changes['initialFilterValue'].currentValue;
      this.filterValue = cloneDeep(currentFilterValue);
    }
    if (this.firstNotNullFilterUpdates(changes)) {
      this.innactiveFilters = Object.keys(this.filterUpdates);
      if (this.initialFilterValue) {
        this.chips = this.initializeChips(this.initialFilterValue);
      } else if (this.defaultFilters) {
        this.openDefaultFilters(this.defaultFilters);
      }
      this.sortFilterCategories(
        this.innactiveFilters,
        this.filterCategoryLabels
      );
    } else if (
      changes['filterUpdates'] &&
      changes['filterUpdates'].currentValue
    ) {
      this.updateFilterItemsCount();
    }
  }

  addFilter(filterCategory: string) {
    this.chips.push({
      name: filterCategory,
      items: this.filterUpdates && this.filterUpdates[filterCategory],
    });
    this.innactiveFilters = this.innactiveFilters.filter(
      (f) => f !== filterCategory
    );
  }

  onDelete(filterCategory: string) {
    this.ngSelectModel = null;
    this.chips = this.chips.filter((c) => c.name !== filterCategory);
    this.innactiveFilters = [...this.innactiveFilters, filterCategory];
    this.sortFilterCategories(this.innactiveFilters, this.filterCategoryLabels);
    this.filterValue[filterCategory] = null;
    this.filter.emit({ ...this.filterValue });
  }

  onSelect(filterCategory: string, values: string[]) {
    this.filterValue[filterCategory] = values;
    this.filter.emit({ ...this.filterValue });
  }

  private openDefaultFilters(defaultFilters: string[] = []) {
    if (
      !this.initialFilterValue ||
      !(
        this.initialFilterValue &&
        Object.values(this.initialFilterValue).some((v) => v && v.length)
      )
    ) {
      defaultFilters.forEach((defaultFilter) => this.addFilter(defaultFilter));
    }
  }

  private firstNotNullInitialFilterValue(changes: SimpleChanges): boolean {
    return !!(
      changes['initialFilterValue'] &&
      !changes['initialFilterValue'].previousValue &&
      changes['initialFilterValue'].currentValue
    );
  }

  private firstNotNullFilterUpdates(changes: SimpleChanges): boolean {
    return !!(
      changes['filterUpdates'] &&
      !changes['filterUpdates'].previousValue &&
      changes['filterUpdates'].currentValue
    );
  }

  private initializeChips(filterValue: ListBoxFilter): Chips[] {
    return Object.entries(filterValue)
      .filter(([filterCategory, activatedFilters]) =>
        Array.isArray(activatedFilters)
      )
      .map(([filterCategory]) => {
        this.innactiveFilters = this.innactiveFilters.filter(
          (f) => f !== filterCategory
        );
        return {
          name: filterCategory,
          items: this.filterItemsWithInitializedSelection(
            filterCategory,
            this.filterUpdates[filterCategory],
            filterValue
          ),
        };
      });
  }

  private filterItemsWithInitializedSelection(
    filterCategory: string,
    items: FilterItem[],
    filterValue: ListBoxFilter
  ): FilterItem[] {
    return items.map((i) => ({
      ...i,
      selected: (filterValue[filterCategory] || []).includes(i.name),
    }));
  }

  private updateFilterItemsCount() {
    this.chips.forEach((chipsItem) => {
      const items = cloneDeep(chipsItem.items);
      items.forEach(
        (item, i) => (item.count = this.filterUpdates[chipsItem.name][i]?.count)
      );
      chipsItem.items = items;
    });
  }

  private sortFilterCategories(
    filterCategories: string[],
    labels: Record<string, string>
  ) {
    filterCategories.sort((a, b) => (labels[a] > labels[b] ? 1 : -1));
  }
}

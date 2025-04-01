import { Component, EventEmitter, Output } from '@angular/core';
import { Sort } from '../../types/sort.interface';

@Component({
    selector: 'app-sortable-table',
    template: '',
})
export class SortableTableComponent {
    @Output() sort: EventEmitter<Sort> = new EventEmitter<Sort>();
    sortDirections = {};
    onSort(sort: Sort) {
        this.sortDirections = { [sort.by]: sort.direction };
        this.sort.emit(sort);
    }
}

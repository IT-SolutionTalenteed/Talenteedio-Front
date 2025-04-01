import { Component, Input } from '@angular/core';
import { SortableTableComponent } from 'src/app/shared/components/sortable-table/sortable-table.component';
import { SortDirection } from 'src/app/shared/types/sort.interface';

@Component({
  selector: 'app-table-draft',
  templateUrl: './table-draft.component.html',
  styleUrls: ['./table-draft.component.scss']
})
export class TableDraftComponent extends SortableTableComponent{
    @Input() items;
    @Input() currentItem;
    @Input() editEnabled;
    @Input() deleteEnabled;
    @Input() isEditingOrDetail;
    sortDirection = SortDirection;
}

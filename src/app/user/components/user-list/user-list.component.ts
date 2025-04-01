import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SortableTableComponent } from 'src/app/shared/components/sortable-table/sortable-table.component';
import { User } from 'src/app/shared/models/user.interface';
import { SortDirection } from 'src/app/shared/types/sort.interface';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent extends SortableTableComponent {
    @Input() users: User[];
    @Input() currentUser: User;
    @Input() editEnabled = true;
    @Input() deleteEnabled = true;
    @Output() view: EventEmitter<User> = new EventEmitter<User>();
    @Output() edit: EventEmitter<User> = new EventEmitter<User>();
    @Output() delete: EventEmitter<User> = new EventEmitter<User>();
    sortDirection = SortDirection;
}

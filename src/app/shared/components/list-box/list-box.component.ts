import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FilterItem } from '../../types/filter-updates.interface';
import { uuid } from '../../utils/uuid.utils';

@Component({
    selector: 'app-list-box',
    templateUrl: './list-box.component.html',
    styleUrls: ['./list-box.component.scss']
})
export class ListBoxComponent {
    @Input() set items(items: FilterItem[]) {
        if (items && items.length) {
            this.form = this.initForm(items, !this.form);
            this.form.get('items').valueChanges.subscribe(this.onChanges.bind(this));
        }
    }
    @Input() labels: Record<string, string>;
    @Output() select: EventEmitter<FilterItem[]> = new EventEmitter<FilterItem[]>();
    @ViewChildren('label') labelChildren: QueryList<ElementRef>;

    form: UntypedFormGroup;
    id = uuid();

    private selections: Record<string, boolean> = {};

    constructor(private formBuilder: UntypedFormBuilder) {}

    getFormArray(formArrayName: string): UntypedFormArray {
        return this.form && (this.form.get(formArrayName) as UntypedFormArray);
    }

    filter(controls: AbstractControl[]) {
        return controls.filter(c =>
            this.form.value.search
                ? ((this.labels && this.labels[c.value.name]) || c.value.name)
                      .toLowerCase()
                      .indexOf(this.form.value.search.toLowerCase()) >= 0
                : true
        );
    }

    private onChanges() {
        setTimeout(() => {
            const selectedItems: FilterItem[] = this.form.value.items.filter(i => i.selected);
            this.selections = Object.assign({}, ...selectedItems.map(({ name }) => ({ [name]: true })));
            this.select.emit(selectedItems);
        });
    }

    private initForm(items: FilterItem[], initializeSelection: boolean): UntypedFormGroup {
        return this.formBuilder.group({
            search: [''],
            items: this.formBuilder.array(items.map(item => this.initFormArrayItem(item, initializeSelection)))
        });
    }

    private initFormArrayItem({ name, count, selected }: FilterItem, initializeSelection: boolean) {
        initializeSelection && (this.selections[name] = selected);
        return this.formBuilder.group({
            name: [name],
            selected: [!!this.selections[name]],
            count: [count]
        });
    }
}

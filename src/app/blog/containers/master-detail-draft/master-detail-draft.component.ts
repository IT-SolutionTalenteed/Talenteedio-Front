/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component } from '@angular/core';
import { SortDirection } from 'src/app/shared/types/sort.interface';
import { ListCriteria } from './../../../shared/types/list-criteria.interface';

@Component({
  selector: 'app-master-detail-draft',
  templateUrl: './master-detail-draft.component.html',
  styleUrls: ['./master-detail-draft.component.scss'],
})
export class MasterDetailDraftComponent {
  items = [
    {
      _id: '1',
      col1: 'col1',
      col2: 'col2',
      col3: 'col3',
      col4: 'col4',
    },
    {
      _id: '2',
      col1: 'col1',
      col2: 'col2',
      col3: 'col3',
      col4: 'col4',
    },
    {
      _id: '3',
      col1: 'col1',
      col2: 'col2',
      col3: 'col3',
      col4: 'col4',
    },
  ];
  currentItem = {
    _id: '3',
    col1: 'col1',
    col2: 'col2',
    col3: 'col3',
    col4: 'col4',
  };
  editEnabled = false;
  deleteEnabled = false;
  isEditingOrDetail = true;
  criteria: ListCriteria = {
    page: { page: 1, pageSize: 15 },
    sort: { by: 'name', direction: SortDirection.asc },
    search: '',
  };

  onSearch(search) {
    // console.log(search);
  }

  onSort(sortDetail) {
    // console.log(sortDetail);
  }

  onViewDetail(viewDetail) {
    // console.log(viewDetail);
  }

  onEdit(editDetail) {
    // console.log(editDetail);
  }
  onDelete(deleteDetail) {
    // console.log(deleteDetail);
  }

  onPaginate(pagination) {
    // console.log(pagination);
  }
}

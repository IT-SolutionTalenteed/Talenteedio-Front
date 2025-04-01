import { MemoizedSelector, select, Store } from '@ngrx/store';
import { filter, skip } from 'rxjs/operators';
import { ModalComponent } from '../components/modal/modal.component';

export const subscribeModal = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>,
  selector: MemoizedSelector<object, boolean>,
  compareWith: boolean,
  modal: ModalComponent
) =>
  store
    .pipe(
      select(selector),
      skip(1),
      filter((res) => res === compareWith)
    )
    .subscribe(() => modal.open());

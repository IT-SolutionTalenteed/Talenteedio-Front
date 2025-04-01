import { Component, Input } from '@angular/core';
import { UpdateStatus } from '../../types/update-status.interface';

@Component({
    selector: 'app-auto-update-status',
    templateUrl: './auto-update-status.component.html',
    styleUrls: ['./auto-update-status.component.scss']
})
export class AutoUpdateStatusComponent {
    @Input() updateStatus: UpdateStatus;
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'clientType',
})
export class ClientTypePipe implements PipeTransform {
    // eslint-disable-next-line complexity
    transform(value): string {
        switch (value) {
            case 'COMPANY':
                return 'Entreprise';
            case 'INDIVIDUAL':
                return 'Particulier';
            default:
                return '';
        }
    }
}

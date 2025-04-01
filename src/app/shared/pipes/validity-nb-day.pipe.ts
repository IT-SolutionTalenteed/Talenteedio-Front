import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'validityNbDay',
})
export class ValidityNbDayPipe implements PipeTransform {
    transform(value): unknown {
        return value > 1 ? `${value} jours` : `${value} jour`;
    }
}

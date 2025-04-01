import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'monthLabel',
})
export class MonthLabelPipe implements PipeTransform {
    transform(months: number[]): string[] {
        const monthsLabel = {
            0: 'Janvier',
            1: 'Février',
            2: 'Mars',
            3: 'Avril',
            4: 'Mai',
            5: 'Juin',
            6: 'Juillet',
            7: 'Août',
            8: 'Septembre',
            9: 'Octobre',
            10: 'Novembre',
            11: 'Décembre',
        };
        return months.map((m) => monthsLabel[m]);
    }
}

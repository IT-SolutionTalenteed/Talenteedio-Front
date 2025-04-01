import { Directive, ElementRef, HostListener } from '@angular/core';
import { parseInt } from 'lodash';

@Directive({
    selector: 'input[appThousandSeparator]',
})
export class ThousandSeparatorDirective {
    constructor(private _inputEl: ElementRef) {}

    @HostListener('input', ['$event'])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onInput(event: any) {
        if (this._inputEl.nativeElement.value === '-') {
            return;
        }
        const commasRemoved = this._inputEl.nativeElement.value.split(/\s/).join('');
        let toInt: number;
        let toLocale: string;
        if (commasRemoved.split('.').length > 1) {
            const decimal = this.getDecimal(commasRemoved);
            toInt = parseInt(commasRemoved);
            toLocale = `${toInt.toLocaleString('fr-FR')}.${decimal}`;
        } else {
            toInt = parseInt(commasRemoved);
            toLocale = toInt.toLocaleString('fr-FR');
        }
        if (toLocale === 'NaN') {
            this._inputEl.nativeElement.value = '';
        } else {
            this._inputEl.nativeElement.value = toLocale;
        }
    }
    private getDecimal(commasRemoved) {
        const splitZero = commasRemoved.split('.')[1].split('0');
        let decimal = '';
        if (commasRemoved.split('.')[1] !== '') {
            for (let i = 0; i < splitZero.length; i++) {
                if (i === splitZero.length - 1) {
                    decimal = `${decimal}${isNaN(parseInt(splitZero[i])) ? '' : parseInt(splitZero[i])}`;
                } else {
                    decimal = `${decimal}${isNaN(parseInt(splitZero[i])) ? '' : parseInt(splitZero[i])}0`;
                }
            }
        }

        return decimal;
    }
}

import { Pipe, PipeTransform } from '@angular/core';

export type TranslatePipeKey<T> = Record<keyof T, string>;

@Pipe({
    name: 'translate',
})
export class TranslatePipe implements PipeTransform {
    transform(value: string, translateKey: Record<string, string>): string {
        return translateKey[value];
    }
}

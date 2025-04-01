import { Pipe, PipeTransform } from '@angular/core';

export type TranslatePipeKey<T> = Record<keyof T, string>;

@Pipe({
    name: 'join',
})
export class JoinedListPipe implements PipeTransform {
    transform(items: string[]): string {
        return (items || []).join(', ');
    }
}

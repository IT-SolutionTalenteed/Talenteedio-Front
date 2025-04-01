/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cast',
})
export class CastPipe implements PipeTransform {
  transform<T>(value: any, clss: (new (...args: any[]) => T) | T): T {
    return value as T;
  }
}

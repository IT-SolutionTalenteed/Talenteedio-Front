/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, forwardRef, Input, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SwitchComponent),
            multi: true
        }
    ]
})
export class SwitchComponent implements ControlValueAccessor {
    @ViewChild('checkbox') checkbox: ElementRef;

    constructor(private readonly renderer: Renderer2) { }
    // tslint:disable: no-input-rename variable-name no-any no-empty
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('value') _value = false;
    onChange: any = () => { };
    onTouched: any = () => { };
    disabled: boolean;

    @Input() showLabel = false;

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.onChange(val);
        this.onTouched();
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    writeValue(value) {
        this.value = value;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
        this.renderer.setProperty(this.checkbox.nativeElement, 'disabled', isDisabled);
    }

    switch() {
        this.value = !this.value;
    }
}

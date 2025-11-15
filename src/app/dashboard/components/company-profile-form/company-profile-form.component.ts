import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { User } from 'src/app/shared/models/user.interface';
import { Company } from 'src/app/shared/models/company.interface';
import { markFormAsTouchedAndDirty } from 'src/app/shared/utils/form.utils';
import { PHONE_CONFIG } from 'src/app/authentication/constants/authentication.constant';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-company-profile-form',
  templateUrl: './company-profile-form.component.html',
  styleUrls: ['./company-profile-form.component.scss']
})
export class CompanyProfileFormComponent implements OnInit {
  @Input() set user(value: User) {
    if (value) {
      this._user = value;
      this.initializeForm();
    }
  }

  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('first', { static: false }) firstInput: ElementRef;

  form: FormGroup;
  config = PHONE_CONFIG;
  categories: Array<{ id: string; name: string }> = [];
  logoFile: File | null = null;
  logoFileName: string | null = null;
  logoError = false;
  logoTouched = false;
  currentLogoUrl: string | null = null;

  private _user: User;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCompanyCategories();
  }

  private initializeForm() {
    const company = this._user?.company;
    
    this.form = this.fb.group({
      firstname: [this._user?.firstname || '', Validators.required],
      lastname: [this._user?.lastname || '', Validators.required],
      email: [this._user?.email || '', [Validators.required, Validators.email]],
      phone: [this._user?.phone || '', Validators.required],
      company_name: [company?.company_name || '', Validators.required],
      slogan: [company?.slogan || ''],
      description: [company?.description || ''],
      about: [company?.about || ''],
      headquarters: [company?.headquarters || ''],
      categoryId: [company?.categoryId || ''],
      website: [company?.website || ''],
      linkedin: [company?.socialNetworks?.linkedin || ''],
      twitter: [company?.socialNetworks?.twitter || ''],
      facebook: [company?.socialNetworks?.facebook || ''],
    });

    this.currentLogoUrl = company?.logo?.fileUrl || null;
    
    setTimeout(() => {
      this.setFocusOnFirstInput();
    });
  }

  private loadCompanyCategories() {
    const props = {
      input: { limit: null, page: null },
      filter: { name: '', status: '', model: 'Company' },
    };
    
    this.apollo
      .query<any>({
        query: gql`
          query GetCategories($input: PaginationInput, $filter: CategoryFilter) {
            getCategories(input: $input, filter: $filter) {
              rows {
                id
                name
              }
            }
          }
        `,
        variables: props,
        fetchPolicy: 'network-only',
        context: {
          uri: `${environment.apiBaseUrl}/category`,
        },
      })
      .subscribe((res) => {
        this.categories = res?.data?.getCategories?.rows ?? [];
      });
  }

  onLogoSelected(event: any) {
    const file = event?.target?.files?.[0];
    this.logoFile = file ?? null;
    this.logoFileName = file?.name ?? null;
    this.logoTouched = true;

    // Preview the image
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentLogoUrl = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(form: FormGroup) {
    if (this.form.valid) {
      const formValue = form.value;
      const payload = {
        user: {
          firstname: formValue.firstname,
          lastname: formValue.lastname,
          email: formValue.email,
          phone: (formValue.phone as any)?.internationalNumber || formValue.phone,
        },
        company: {
          company_name: formValue.company_name,
          slogan: formValue.slogan,
          description: formValue.description,
          about: formValue.about,
          headquarters: formValue.headquarters,
          categoryId: formValue.categoryId,
          website: formValue.website,
          socialNetworks: {
            linkedin: formValue.linkedin,
            twitter: formValue.twitter,
            facebook: formValue.facebook,
          },
        },
        logoFile: this.logoFile,
      };
      this.save.emit(payload);
    } else {
      this.showErrors();
    }
  }

  private setFocusOnFirstInput() {
    this.firstInput?.nativeElement?.focus();
  }

  private showErrors() {
    markFormAsTouchedAndDirty(this.form);
  }
}

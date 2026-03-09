import { Pipe, PipeTransform } from '@angular/core';
import { Company } from '../models/company.interface';

@Pipe({
  name: 'companySlug',
  pure: true
})
export class CompanySlugPipe implements PipeTransform {
  transform(company: Company): string {
    if (!company || !company.id || !company.company_name) {
      return '';
    }

    // Decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = company.company_name;
    const decodedName = textarea.value;

    // Generate slug from company name
    const slug = decodedName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Get first 8 characters of ID
    const shortId = company.id.substring(0, 8);

    return `${slug}-${shortId}`;
  }
}

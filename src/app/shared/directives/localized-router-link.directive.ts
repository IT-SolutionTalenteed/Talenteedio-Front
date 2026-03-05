import { Directive, Input, HostListener, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { LocalizedRouterService } from '../../services/localized-router.service';

@Directive({
  selector: '[localizedRouterLink]'
})
export class LocalizedRouterLinkDirective {
  @Input() localizedRouterLink: any[] | string;
  @Input() queryParams?: any;

  @HostBinding('attr.href') href: string;

  constructor(
    private localizedRouter: LocalizedRouterService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateHref();
  }

  ngOnChanges() {
    this.updateHref();
  }

  private updateHref() {
    const commands = Array.isArray(this.localizedRouterLink) 
      ? this.localizedRouterLink 
      : [this.localizedRouterLink];
    
    const path = commands.join('/');
    this.href = this.localizedRouter.getLocalizedPath(path);
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): boolean {
    // Permettre le comportement par défaut si Ctrl/Cmd est pressé
    if (event.ctrlKey || event.metaKey) {
      return true;
    }

    event.preventDefault();
    
    const commands = Array.isArray(this.localizedRouterLink) 
      ? this.localizedRouterLink 
      : [this.localizedRouterLink];
    
    this.localizedRouter.navigate(commands, { queryParams: this.queryParams });
    return false;
  }
}

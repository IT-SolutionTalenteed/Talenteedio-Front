import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-static-pages',
  template: `<div class="static-page-wrapper" [innerHTML]="htmlContent"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }
    
    .static-page-wrapper {
      width: 100%;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    /* Reset des styles Angular qui pourraient interférer */
    :host ::ng-deep body {
      margin: 0;
      padding: 0;
      width: 100%;
    }
  `]
})
export class StaticPagesComponent implements OnInit {
  htmlContent: SafeHtml = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const page = data['page'];
      this.loadPage(page);
    });
  }

  private loadPage(page: string): void {
    this.http.get(`assets/static/${page}.html`, { responseType: 'text' })
      .subscribe({
        next: (html) => {
          // Remplacer les chemins relatifs des assets
          const processedHtml = html
            .replace(/href="assets\//g, 'href="assets/static/assets/')
            .replace(/src="assets\//g, 'src="assets/static/assets/');
          
          this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(processedHtml);
        },
        error: (err) => {
          console.error('Erreur chargement page statique:', err);
          this.htmlContent = this.sanitizer.bypassSecurityTrustHtml('<h1>Page non trouvée</h1>');
        }
      });
  }
}

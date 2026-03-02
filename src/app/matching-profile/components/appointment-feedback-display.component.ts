import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-appointment-feedback-display',
  template: `
    <div class="feedback-display">
      <div class="feedback-header">
        <h4>Votre feedback</h4>
        <span class="feedback-date">{{ formatDate(feedbackSubmittedAt) }}</span>
      </div>

      <div class="feedback-decision" [ngClass]="decisionClass">
        <i [class]="decisionIcon"></i>
        <span>{{ decisionText }}</span>
      </div>

      <div *ngIf="rating" class="feedback-rating">
        <span class="rating-label">Votre note:</span>
        <div class="stars">
          <i
            *ngFor="let star of [1, 2, 3, 4, 5]"
            class="bi"
            [class.bi-star-fill]="star <= rating"
            [class.bi-star]="star > rating"
          ></i>
        </div>
      </div>

      <div class="feedback-text">
        <p>{{ feedback }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .feedback-display {
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 12px;
        margin-top: 1rem;
      }

      .feedback-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h4 {
          margin: 0;
          font-size: 1.1rem;
          color: #333;
        }

        .feedback-date {
          font-size: 0.875rem;
          color: #6c757d;
        }
      }

      .feedback-decision {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-weight: 500;

        i {
          font-size: 1.5rem;
        }

        &.decision-go {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        &.decision-not {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      }

      .feedback-rating {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;

        .rating-label {
          font-weight: 500;
          color: #495057;
        }

        .stars {
          display: flex;
          gap: 0.25rem;

          i {
            color: #ffc107;
            font-size: 1.2rem;
          }
        }
      }

      .feedback-text {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid #dee2e6;

        p {
          margin: 0;
          line-height: 1.6;
          color: #495057;
          white-space: pre-wrap;
        }
      }
    `,
  ],
})
export class AppointmentFeedbackDisplayComponent {
  @Input() feedback!: string;
  @Input() decision!: string;
  @Input() rating?: number;
  @Input() feedbackSubmittedAt!: string;

  get decisionClass(): string {
    return this.decision === 'go' ? 'decision-go' : 'decision-not';
  }

  get decisionIcon(): string {
    return this.decision === 'go' ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill';
  }

  get decisionText(): string {
    return this.decision === 'go'
      ? 'Vous êtes intéressé(e) par cette opportunité'
      : 'Vous n\'êtes pas intéressé(e) par cette opportunité';
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

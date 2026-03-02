import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';

const SUBMIT_FEEDBACK_MUTATION = gql`
  mutation SubmitAppointmentFeedback(
    $appointmentId: ID!
    $feedback: String!
    $decision: String!
    $rating: Int
  ) {
    submitAppointmentFeedback(
      appointmentId: $appointmentId
      feedback: $feedback
      decision: $decision
      rating: $rating
    ) {
      id
      feedbackSubmitted
      candidateFeedback
      candidateDecision
      candidateRating
      feedbackSubmittedAt
    }
  }
`;

@Component({
  selector: 'app-appointment-feedback-form',
  template: `
    <div class="feedback-form-container">
      <div class="feedback-header">
        <h3>Comment s'est passé votre entretien ?</h3>
        <p class="company-name">{{ companyName }}</p>
      </div>

      <form [formGroup]="feedbackForm" (ngSubmit)="onSubmit()">
        <!-- Décision Go/Not -->
        <div class="form-group decision-group">
          <label class="form-label">Votre décision</label>
          <div class="decision-buttons">
            <button
              type="button"
              class="decision-btn"
              [class.active]="feedbackForm.get('decision')?.value === 'go'"
              (click)="setDecision('go')"
            >
              <i class="bi bi-check-circle-fill"></i>
              <span>Je suis intéressé(e)</span>
            </button>
            <button
              type="button"
              class="decision-btn"
              [class.active]="feedbackForm.get('decision')?.value === 'not'"
              (click)="setDecision('not')"
            >
              <i class="bi bi-x-circle-fill"></i>
              <span>Je ne suis pas intéressé(e)</span>
            </button>
          </div>
          <div
            *ngIf="
              feedbackForm.get('decision')?.invalid &&
              feedbackForm.get('decision')?.touched
            "
            class="error-message"
          >
            Veuillez sélectionner une décision
          </div>
        </div>

        <!-- Note (optionnel) -->
        <div class="form-group rating-group">
          <label class="form-label">
            Note de l'entretien <span class="optional">(optionnel)</span>
          </label>
          <div class="rating-stars">
            <i
              *ngFor="let star of [1, 2, 3, 4, 5]"
              class="bi"
              [class.bi-star-fill]="star <= (feedbackForm.get('rating')?.value || 0)"
              [class.bi-star]="star > (feedbackForm.get('rating')?.value || 0)"
              (click)="setRating(star)"
            ></i>
          </div>
        </div>

        <!-- Feedback textuel -->
        <div class="form-group">
          <label class="form-label" for="feedback">
            Votre retour sur l'entretien
          </label>
          <textarea
            id="feedback"
            class="form-control"
            formControlName="feedback"
            rows="6"
            placeholder="Partagez votre expérience : comment s'est déroulé l'entretien ? Qu'avez-vous pensé de l'entreprise et du poste proposé ?"
          ></textarea>
          <div
            *ngIf="
              feedbackForm.get('feedback')?.invalid &&
              feedbackForm.get('feedback')?.touched
            "
            class="error-message"
          >
            Veuillez saisir votre feedback (minimum 10 caractères)
          </div>
        </div>

        <!-- Boutons -->
        <div class="form-actions">
          <button
            type="button"
            class="btn btn-secondary"
            (click)="onCancel()"
            [disabled]="loading"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="feedbackForm.invalid || loading"
          >
            <span *ngIf="!loading">Envoyer mon feedback</span>
            <span *ngIf="loading">
              <i class="bi bi-hourglass-split"></i> Envoi en cours...
            </span>
          </button>
        </div>

        <div *ngIf="error" class="alert alert-danger mt-3">
          {{ error }}
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .feedback-form-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .feedback-header {
        text-align: center;
        margin-bottom: 2rem;

        h3 {
          color: #333;
          margin-bottom: 0.5rem;
        }

        .company-name {
          color: #007bff;
          font-size: 1.1rem;
          font-weight: 500;
        }
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #495057;

        .optional {
          font-weight: 400;
          color: #6c757d;
          font-size: 0.875rem;
        }
      }

      .decision-group {
        .decision-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .decision-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem 1rem;
          border: 2px solid #dee2e6;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;

          i {
            font-size: 2rem;
            color: #6c757d;
          }

          span {
            font-weight: 500;
            color: #495057;
          }

          &:hover {
            border-color: #007bff;
            background: #f8f9fa;
          }

          &.active {
            border-color: #007bff;
            background: #e7f3ff;

            i {
              color: #007bff;
            }

            span {
              color: #007bff;
            }
          }
        }
      }

      .rating-group {
        .rating-stars {
          display: flex;
          gap: 0.5rem;

          i {
            font-size: 2rem;
            color: #ffc107;
            cursor: pointer;
            transition: transform 0.2s;

            &:hover {
              transform: scale(1.2);
            }

            &.bi-star {
              color: #dee2e6;
            }
          }
        }
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ced4da;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.2s;

        &:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      .btn-primary {
        background: #007bff;
        color: white;

        &:hover:not(:disabled) {
          background: #0056b3;
        }
      }

      .btn-secondary {
        background: #6c757d;
        color: white;

        &:hover:not(:disabled) {
          background: #545b62;
        }
      }

      .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .alert {
        padding: 1rem;
        border-radius: 6px;
        margin-top: 1rem;
      }

      .alert-danger {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }
    `,
  ],
})
export class AppointmentFeedbackFormComponent {
  @Input() appointmentId!: string;
  @Input() companyName!: string;
  @Output() feedbackSubmitted = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  feedbackForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private apollo: Apollo) {
    this.feedbackForm = this.fb.group({
      decision: ['', Validators.required],
      rating: [null],
      feedback: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  setDecision(decision: string): void {
    this.feedbackForm.patchValue({ decision });
  }

  setRating(rating: number): void {
    const currentRating = this.feedbackForm.get('rating')?.value;
    // Si on clique sur la même étoile, on désélectionne
    this.feedbackForm.patchValue({ rating: currentRating === rating ? null : rating });
  }

  onSubmit(): void {
    if (this.feedbackForm.invalid) {
      Object.keys(this.feedbackForm.controls).forEach((key) => {
        this.feedbackForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;

    const { decision, rating, feedback } = this.feedbackForm.value;

    this.apollo
      .mutate({
        mutation: SUBMIT_FEEDBACK_MUTATION,
        variables: {
          appointmentId: this.appointmentId,
          feedback,
          decision,
          rating,
        },
      })
      .subscribe({
        next: (result: any) => {
          this.loading = false;
          this.feedbackSubmitted.emit(result.data.submitAppointmentFeedback);
        },
        error: (error) => {
          this.loading = false;
          this.error =
            error.message || 'Une erreur est survenue lors de l\'envoi du feedback';
          console.error('Error submitting feedback:', error);
        },
      });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}

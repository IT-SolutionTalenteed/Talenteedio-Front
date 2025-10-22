import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faCircleUser, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { MediaService } from '../../services/media.service';

@Component({
  selector: 'app-profile-picture-upload',
  templateUrl: './profile-picture-upload.component.html',
  styleUrls: ['./profile-picture-upload.component.scss']
})
export class ProfilePictureUploadComponent {
  @Input() currentPictureUrl: string | null = null;
  @Input() disabled = false;
  @Output() pictureChanged = new EventEmitter<string>();
  @Output() pictureRemoved = new EventEmitter<void>();

  isUploading = false;
  uploadError: string | null = null;

  faCircleUser = faCircleUser;
  faUpload = faUpload;
  faTrash = faTrash;

  constructor(private mediaService: MediaService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        this.uploadError = 'Veuillez sélectionner une image valide';
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.uploadError = 'L\'image ne doit pas dépasser 5MB';
        return;
      }

      this.uploadError = null;
      this.isUploading = true;

      this.mediaService.uploadImage(file).subscribe({
        next: (media) => {
          this.isUploading = false;
          this.currentPictureUrl = media.fileUrl;
          this.pictureChanged.emit(media.id);
        },
        error: (error) => {
          this.isUploading = false;
          this.uploadError = 'Erreur lors de l\'upload de l\'image';
          console.error('Upload error:', error);
        }
      });
    }
  }

  removePicture() {
    this.currentPictureUrl = null;
    this.pictureRemoved.emit();
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }
}

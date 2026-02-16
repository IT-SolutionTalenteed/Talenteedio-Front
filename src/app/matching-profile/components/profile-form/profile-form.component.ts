import { Component, EventEmitter, Input, OnInit, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchingProfileService } from '../../services/matching-profile.service';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit, OnChanges {
  @Input() profile: any;
  @Output() save = new EventEmitter<any>();
  @Output() next = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  loadingData = true;
  error: string | null = null;
  success: string | null = null;
  selectedFile: File | null = null;
  isDragOver = false;

  // Listes d'options chargées depuis la base de données
  skillsOptions: string[] = [];
  interestsOptions: string[] = [
    'Intelligence Artificielle', 'Machine Learning', 'Data Science',
    'Développement Web', 'Développement Mobile', 'Cloud Computing',
    'Cybersécurité', 'Blockchain', 'IoT', 'DevOps',
    'Architecture Logicielle', 'Microservices', 'API Design',
    'UX/UI Design', 'Product Management', 'Agile',
    'Innovation Technologique', 'Transformation Digitale',
    'Développement Durable', 'Green IT', 'Accessibilité',
    'Open Source', 'Startup', 'E-commerce', 'Fintech',
    'HealthTech', 'EdTech', 'Gaming', 'Réalité Virtuelle'
  ];
  sectorsOptions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private matchingProfileService: MatchingProfileService
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      interests: [[], []],
      skills: [[], []],
      currentSectorId: [''],
      targetSectorIds: [[], []]
    });
  }

  ngOnInit(): void {
    // Charger les données depuis la base de données
    this.loadingData = true;
    
    // Charger les compétences
    this.matchingProfileService.getAvailableSkills().subscribe({
      next: (skills) => {
        this.skillsOptions = skills.map(s => s.name).sort();
        this.checkDataLoaded();
      },
      error: (err) => {
        console.error('Error loading skills:', err);
        // Utiliser des valeurs par défaut en cas d'erreur
        this.skillsOptions = [
          'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go',
          'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Spring', 'Laravel',
          'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
          'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP'
        ];
        this.checkDataLoaded();
      }
    });

    // Charger les secteurs
    this.matchingProfileService.getAvailableSectors().subscribe({
      next: (sectors) => {
        this.sectorsOptions = sectors.map(s => s.name).sort();
        this.checkDataLoaded();
      },
      error: (err) => {
        console.error('Error loading sectors:', err);
        // Utiliser des valeurs par défaut en cas d'erreur
        this.sectorsOptions = [
          'Informatique', 'Technologies', 'Finance', 'Santé',
          'E-commerce', 'Industrie', 'Conseil', 'Éducation'
        ];
        this.checkDataLoaded();
      }
    });

    this.loadProfileData();
  }

  ngOnChanges(): void {
    // Reset form when profile input changes (for new matching)
    if (this.form) {
      this.loadProfileData();
    }
  }

  private loadProfileData(): void {
    if (this.profile) {
      this.form.patchValue({
        title: this.profile.title || '',
        interests: this.profile.interests || [],
        skills: this.profile.skills || [],
        currentSectorId: this.profile.currentSector?.id || '',
        targetSectorIds: this.profile.targetSectorIds || []
      });
    } else {
      // Reset form for new matching
      this.form.reset({
        title: '',
        interests: [],
        skills: [],
        currentSectorId: '',
        targetSectorIds: []
      });
      this.selectedFile = null;
      this.error = null;
      this.success = null;
    }
  }

  private checkDataLoaded(): void {
    // Vérifier si toutes les données sont chargées
    if (this.skillsOptions.length > 0 && this.sectorsOptions.length > 0) {
      this.loadingData = false;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('cv') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.handleFile(file);
    }
  }

  private handleFile(file: File): void {
    if (file.type === 'application/pdf') {
      this.selectedFile = file;
      this.error = null;
    } else {
      this.error = 'Veuillez sélectionner un fichier PDF';
      this.selectedFile = null;
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const formValue = this.form.value;
    const input = {
      id: this.profile?.id || null,
      title: formValue.title,
      interests: formValue.interests || [],
      skills: formValue.skills || [],
      currentSectorId: formValue.currentSectorId || null,
      targetSectorIds: formValue.targetSectorIds || [],
      cvId: this.profile?.cv?.id || null
    };

    // TODO: Upload CV if selectedFile exists
    // For now, we'll just save the profile

    this.matchingProfileService.saveMatchingProfile(input).subscribe({
      next: (savedProfile) => {
        this.loading = false;
        this.success = 'Profil sauvegardé avec succès !';
        
        // Emit the saved profile
        this.save.emit(savedProfile);
        
        // Wait a bit before emitting next to show success message
        setTimeout(() => {
          this.next.emit();
        }, 1000);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erreur lors de la sauvegarde du profil';
        console.error('Error saving profile:', err);
      }
    });
  }
}

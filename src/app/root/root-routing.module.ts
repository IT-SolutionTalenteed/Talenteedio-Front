import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './components/root/root.component';
import { VerifyGuard } from './guards/verify.guard';

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    canActivate: [VerifyGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'authentication',
        loadChildren: () =>
          import('../authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
      {
        path: 'initiative',
        loadChildren: () =>
          import('../advisor/advisor.module').then((m) => m.AdvisorModule),
      },
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'job',
        loadChildren: () =>
          import('../job/job.module').then((m) => m.JobModule),
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('../blog/blog.module').then((m) => m.BlogModule),
      },
      {
        path: 'voice',
        loadChildren: () =>
          import('../hr-voice/hr-voice.module').then((m) => m.HrVoiceModule),
      },
      {
        path: 'interview',
        loadChildren: () =>
          import('../interview/interview.module').then(
            (m) => m.InterviewModule
          ),
      },
      {
        path: 'event',
        loadChildren: () =>
          import('../event/event.module').then((m) => m.EventModule),
      },

      {
        path: 'terms-and-conditions',
        loadChildren: () =>
          import('../terms-and-conditions/terms-and-conditions.module').then(
            (m) => m.TermsAndConditionsModule
          ),
      },
      {
        path: 'privacy-policy',
        loadChildren: () =>
          import('../privacy-policy/privacy-policy.module').then(
            (m) => m.PrivacyPolicyModule
          ),
      },
      {
        path: 'become-member',
        loadChildren: () =>
          import('../join-us/join-us.module').then((m) => m.JoinUsModule),
      },
      {
        path: 'community',
        loadChildren: () =>
          import('../community/community.module').then(
            (m) => m.CommunityModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RootRoutingModule {}

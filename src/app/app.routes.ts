import { Routes } from '@angular/router';
import { InvitesEditComponent } from './confirmation/invites-edit/invites-edit.component';
import { InvitesListComponent } from './confirmation/invites-list/invites-list.component';
import { listGuard } from './guards/list.guard';

export const routes: Routes = [
  {
    path: 'list',
    component: InvitesListComponent,
    canActivate: [listGuard],
  },
  {
    path: 'invites/:id',
    component: InvitesEditComponent,
  },
];

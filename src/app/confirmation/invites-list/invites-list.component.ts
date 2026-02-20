import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InvitesService } from '../invites.service';
import { InviteData } from '../../shared/models/InviteData.model';

@Component({
  selector: 'app-invites-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './invites-list.component.html',
  styleUrl: './invites-list.component.css',
})
export class InvitesListComponent {
  invites = signal<InviteData[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  totalAdults = computed(() =>
    this.invites()
      .filter((i) => i.updatedAt)
      .reduce((sum, i) => sum + (i.adults ?? 0), 0)
  );

  totalChildren = computed(() =>
    this.invites()
      .filter((i) => i.updatedAt)
      .reduce((sum, i) => sum + (i.children ?? 0), 0)
  );

  constructor(private invitesService: InvitesService) {
    this.loadInvites();
  }

  private loadInvites() {
    this.loading.set(true);

    this.invitesService.getInvites().subscribe({
      next: (data) => {
        this.invites.set(data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los invitados');
        this.loading.set(false);
      },
    });
  }
}

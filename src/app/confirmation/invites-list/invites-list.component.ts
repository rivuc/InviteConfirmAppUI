import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InvitesService } from '../invites.service';
import { InviteData } from '../../shared/models/InviteData.model';
import { environment } from '../../../environments/environment';

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
      .reduce((sum, i) => sum + (i.adults ?? 0), 0),
  );

  totalChildren = computed(() =>
    this.invites()
      .filter((i) => i.updatedAt)
      .reduce((sum, i) => sum + (i.children ?? 0), 0),
  );

  invitedAdults = computed(() =>
    this.invites().reduce((sum, i) => sum + (i.allowedAdults ?? 0), 0),
  );

  invitedChildren = computed(() =>
    this.invites().reduce((sum, i) => sum + (i.allowedChildren ?? 0), 0),
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

  share(invite: InviteData) {
    if (navigator.share) {
      let url = `${environment.uiUrl}invites/${invite.id}`;
      navigator
        .share({
          title: '🎉 Fiesta de Gracielita',
          text: `¡Hola ${invite.family}, Te invitamos a la fiesta de Gracielita 5 años, te esperamos! 🎂🎈\n\n${url}`,
        })
        .catch((error) => console.log('Error al compartir', error));
    } else {
      alert('Tu navegador no soporta compartir 😢');
    }
  }
}

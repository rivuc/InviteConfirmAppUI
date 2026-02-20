import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { InviteData } from '../shared/models/InviteData.model';
import { SaveInvite } from '../shared/dto/save-Invite.dto';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InvitesService {
  private readonly endpoint = `${environment.apiUrl}/api/invites`;
  private data: InviteData | null = null;
  private dataList: InviteData[] | null = null;

  constructor(private http: HttpClient) {}

  getInvite(id: string): Observable<InviteData | null> {
    return this.http.get<InviteData>(`${this.endpoint}/${id}`).pipe(
      catchError((err) => {
        if (err.status === 404) {
          return of(null); // invitación no encontrada
        }
        throw err; // otros errores sí se propagan
      })
    );
  }

  saveInvite(invite: SaveInvite): Observable<boolean> {
    return this.http.put<void>(`${this.endpoint}/${invite.id}`, invite).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  getInvites(): Observable<InviteData[] | null> {
    return this.http.get<InviteData[]>(this.endpoint);
  }
}

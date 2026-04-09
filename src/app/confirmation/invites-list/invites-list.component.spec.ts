import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvitesListComponent } from './invites-list.component';
import { InvitesService } from '../invites.service';
import { of, throwError } from 'rxjs';
import { InviteData } from '../../shared/models/InviteData.model';

describe('InvitesListComponent', () => {
  let component: InvitesListComponent;
  let fixture: ComponentFixture<InvitesListComponent>;
  let invitesServiceMock: any;
  const mockInvites: InviteData[] = [
    {
      id: '1',
      family: 'Rivera',
      allowedAdults: 2,
      allowedChildren: 2,
      adults: 2,
      children: 1,
      isConfirmed: true,
      updatedAt: '2024-01-01',
      mesa: 1,
    },
    {
      id: '2',
      family: 'Lopez',
      allowedAdults: 3,
      allowedChildren: 1,
      adults: 1,
      children: 0,
      isConfirmed: true,
      updatedAt: '2024-01-01',
      mesa: 2,
    },
  ];

  beforeEach(async () => {
    invitesServiceMock = {
      getInvites: vi.fn().mockReturnValue(of(mockInvites)),
    };

    await TestBed.configureTestingModule({
      imports: [InvitesListComponent],
      providers: [{ provide: InvitesService, useValue: invitesServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(InvitesListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load invites on init', () => {
    expect(component.invites()).toEqual(mockInvites);
    expect(component.loading()).toBe(false);
  });

  it('should set error if service fails', () => {
    invitesServiceMock.getInvites.mockReturnValueOnce(throwError(() => new Error('error')));

    fixture = TestBed.createComponent(InvitesListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.error()).toBe('No se pudieron cargar los invitados');
    expect(component.loading()).toBe(false);
  });

  it('should calculate total adults correctly', () => {
    expect(component.totalAdults()).toBe(3);
  });

  it('should calculate total children correctly', () => {
    expect(component.totalChildren()).toBe(1);
  });

  it('should calculate invited adults', () => {
    expect(component.invitedAdults()).toBe(5);
  });

  it('should calculate invited children', () => {
    expect(component.invitedChildren()).toBe(3);
  });

  it('should call navigator.share when available', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);

    (navigator as any).share = shareMock;

    await component.share(mockInvites[0]);

    expect(shareMock).toHaveBeenCalled();
  });

  it('should show alert if navigator.share not available', () => {
    (navigator as any).share = undefined;

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.share(mockInvites[0]);

    expect(alertSpy).toHaveBeenCalledWith('Tu navegador no soporta compartir 😢');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvitesEditComponent } from './invites-edit.component';
import { InvitesService } from '../invites.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ElementRef } from '@angular/core';
import { InviteData } from '../../shared/models/InviteData.model';
import { vi } from 'vitest';

describe('InvitesEditComponent', () => {
  let component: InvitesEditComponent;
  let fixture: ComponentFixture<InvitesEditComponent>;
  let invitesServiceMock: any;
  const mockInvite: InviteData = {
    id: '123',
    family: 'Adams',
    allowedAdults: 2,
    allowedChildren: 4,
    adults: 2,
    children: 1,
    isConfirmed: false,
    updatedAt: '2024-01-01',
    mesa: 5,
  };

  beforeEach(async () => {
    invitesServiceMock = {
      getInvite: vi.fn().mockReturnValue(of(mockInvite)),
      saveInvite: vi.fn(),
    };

    (globalThis as any).IntersectionObserver = class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();

      constructor(callback: any, options?: any) {}
    };

    await TestBed.configureTestingModule({
      imports: [InvitesEditComponent],
      providers: [
        { provide: InvitesService, useValue: invitesServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123',
              },
            },
          },
        },
        {
          provide: ElementRef,
          useValue: {
            nativeElement: document.createElement('div'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvitesEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();

    component.music = {
      nativeElement: {
        currentTime: 0,
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
      },
    } as any;
    component.audio = component.music.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load invite and set allowed values when not confirmed', () => {
    mockInvite.isConfirmed = false;

    //invitesServiceMock.getInvite.mockReturnValue(of(mockInvite));

    component.ngOnInit();

    expect(component.invite()).toEqual(mockInvite);
    expect(component.allowedAdults).toEqual([0, 1, 2]);
    expect(component.allowedChildren).toEqual([0, 1, 2, 3, 4]);
    expect(component.isLoading()).toBe(false);
  });

  it('should call saveInvite and show confirmation', () => {
    mockInvite.isConfirmed = true;
    component.invite.set(mockInvite);
    component.adults = 1;
    component.children = 3;

    invitesServiceMock.saveInvite.mockReturnValue(of({}));
    const toggleSpy = vi.spyOn(component, 'toggleMusic');

    component.save();

    expect(invitesServiceMock.saveInvite).toHaveBeenCalled();
    expect(component.showConfirmation()).toBe(true);
    expect(toggleSpy).toHaveBeenCalled();
  });

  it('should pause music if already playing', () => {
    component.musicPlaying = true;

    component.toggleMusic();

    expect(component.audio!.pause).toHaveBeenCalled();
    expect(component.musicPlaying).toBe(false);
  });

  it('should play music if not playing', async () => {
    component.musicPlaying = false;

    await component.toggleMusic();

    expect(component.audio!.play).toHaveBeenCalled();
    expect(component.musicPlaying).toBe(true);
  });

  it('should show loading state', () => {
    component.isLoading.set(true);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Cargando...');
  });

  it('should show confirmation message', () => {
    component.isLoading.set(false);
    component.showConfirmation.set(true);
    component.confirmationText.set('Confirmado');

    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('h1');

    expect(h1.innerHTML).toContain('Confirmado');
  });
});

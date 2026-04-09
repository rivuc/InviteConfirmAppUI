import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InvitesService } from '../invites.service';
import { InviteData } from '../../shared/models/InviteData.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invites-edit',
  imports: [FormsModule, CommonModule],
  templateUrl: './invites-edit.component.html',
  styleUrl: './invites-edit.component.css',
})
export class InvitesEditComponent implements OnInit, AfterViewInit {
  allowedAdults: Array<number> = [];
  allowedChildren = Array.from({ length: 11 }, (_, i) => i);
  adults: number | null = null;
  children: number | null = null;
  showConfirmation = signal(false);
  confirmationText = signal('');
  isSaving = false;
  isLoading = signal(true);
  invite = signal<InviteData | null>(null);
  private route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');
  musicPlaying = false;
  @ViewChild('music') music!: ElementRef<HTMLAudioElement>;
  audio: HTMLAudioElement | null = null;

  constructor(
    private invitesService: InvitesService,
    private el: ElementRef,
  ) {}

  ngOnInit() {
    this.invitesService.getInvite(this.id!).subscribe((data) => {
      this.invite.set(data);
      if (data?.isConfirmed) {
        this.setConfirmationMsg(data.adults, data.children, data.family);

        this.showConfirmation.set(this.invite()?.isConfirmed!);
      } else {
        this.allowedAdults = Array.from({ length: data?.allowedAdults! + 1 }, (_, i) => i);
        this.allowedChildren = Array.from({ length: data?.allowedChildren! + 1 }, (_, i) => i);
      }
      this.isLoading.set(false);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      document.querySelector('.floating-emojis')?.classList.add('visible');

      const images = this.el.nativeElement.querySelectorAll('.reveal');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('show');
            }
          });
        },
        { threshold: 0.2 },
      );

      images.forEach((img: Element) => observer.observe(img));
    }, 0);

    this.audio = this.music.nativeElement;
    this.audio.currentTime = 61.6;
  }

  loadMusic() {
    const startMusic = () => {
      console.log(navigator.userActivation.hasBeenActive);
      if (navigator.userActivation.hasBeenActive) {
        const audio = this.music.nativeElement;
        audio.currentTime = 61.6;
        audio.volume = 0.25;
        audio
          .play()
          .then(() => {
            removeListeners();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const removeListeners = () => {
      window.removeEventListener('click', startMusic);
      window.removeEventListener('touchstart', startMusic);
      window.removeEventListener('scroll', startMusic);
    };

    window.addEventListener('click', startMusic);
    window.addEventListener('touchstart', startMusic);
    window.addEventListener('scroll', startMusic);
  }

  toggleMusic() {
    if (this.musicPlaying) {
      this.audio!.pause();
      this.musicPlaying = false;
    } else {
      // this.audio!.volume = 0.25;
      this.audio!.play().catch(() => {
        console.log('Error playing audio');
      });
      this.musicPlaying = true;
    }
  }

  save() {
    if (this.isSaving) return;

    this.isSaving = true;
    this.invitesService
      .saveInvite({
        id: this.invite()?.id!,
        adults: this.invite()?.adults!,
        children: this.children!,
        isConfirmed: true,
      })
      .subscribe(() => {
        this.setConfirmationMsg(this.adults!, this.children!, this.invite()?.family!);
        this.showConfirmation.set(true);
        if (!this.musicPlaying) {
          this.toggleMusic();
        }
      });
  }

  setConfirmationMsg(adults: number, children: number, family: string) {
    this.confirmationText.set(
      `🎉 Confirmado para ${adults} adultos y ${children} niños.<br>Familia: ${family} 🧁`,
    );
  }
}

import { TestBed } from '@angular/core/testing';
import { InvitesService } from './invites.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { InviteData } from '../shared/models/InviteData.model';
import { SaveInvite } from '../shared/dto/save-Invite.dto';

describe('InvitesService', () => {
  let service: InvitesService;
  let httpMock: HttpTestingController;
  const mockInvite: InviteData = {
    id: '123',
    family: 'Rivera',
    allowedAdults: 2,
    allowedChildren: 3,
    adults: 2,
    children: 1,
    isConfirmed: false,
    updatedAt: '2024-01-01',
    mesa: 5,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvitesService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(InvitesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return invite when API responds', () => {
    service.getInvite('123').subscribe((res) => {
      expect(res).toEqual(mockInvite);
    });

    const req = httpMock.expectOne(`${service['endpoint']}/123`);
    expect(req.request.method).toBe('GET');

    req.flush(mockInvite);
  });

  it('should return null when 404', () => {
    service.getInvite('123').subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${service['endpoint']}/123`);

    req.flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('should throw error when not 404', () => {
    service.getInvite('123').subscribe({
      next: () => fail('should not emit'),
      error: (err) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(`${service['endpoint']}/123`);

    req.flush(null, { status: 500, statusText: 'Server Error' });
  });

  function fail(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  it('should return true on successful save', () => {
    const saveData: SaveInvite = {
      id: '123',
      adults: 2,
      children: 1,
      isConfirmed: true,
    };

    service.saveInvite(saveData).subscribe((res) => {
      expect(res).toBe(true);
    });

    const req = httpMock.expectOne(`${service['endpoint']}/123`);
    expect(req.request.method).toBe('PUT');

    req.flush({});
  });

  it('should return false on error', () => {
    const saveData: SaveInvite = {
      id: '123',
      adults: 2,
      children: 1,
      isConfirmed: true,
    };

    service.saveInvite(saveData).subscribe((res) => {
      expect(res).toBe(false);
    });

    const req = httpMock.expectOne(`${service['endpoint']}/123`);

    req.flush(null, { status: 500, statusText: 'Error' });
  });

  it('should return list of invites', () => {
    const list = [mockInvite];
    let result: any;

    service.getInvites().subscribe((res) => {
      result = res;
    });

    const req = httpMock.expectOne(service['endpoint']);
    req.flush(list);

    expect(result).toEqual(list);
  });
});

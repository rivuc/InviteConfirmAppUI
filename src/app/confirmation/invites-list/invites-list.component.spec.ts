import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitesListComponent } from './invites-list.component';

describe('InvitesListComponent', () => {
  let component: InvitesListComponent;
  let fixture: ComponentFixture<InvitesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitesListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

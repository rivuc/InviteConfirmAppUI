import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitesEditComponent } from './invites-edit.component';

describe('InvitesEditComponent', () => {
  let component: InvitesEditComponent;
  let fixture: ComponentFixture<InvitesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitesEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitesEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

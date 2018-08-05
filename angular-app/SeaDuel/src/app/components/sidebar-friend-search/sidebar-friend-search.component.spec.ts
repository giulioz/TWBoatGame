import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFriendSearchComponent } from './sidebar-friend-search.component';

describe('SidebarFriendSearchComponent', () => {
  let component: SidebarFriendSearchComponent;
  let fixture: ComponentFixture<SidebarFriendSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarFriendSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarFriendSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

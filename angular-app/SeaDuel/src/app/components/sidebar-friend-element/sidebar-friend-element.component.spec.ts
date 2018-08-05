import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFriendElementComponent } from './sidebar-friend-element.component';

describe('SidebarFriendElementComponent', () => {
  let component: SidebarFriendElementComponent;
  let fixture: ComponentFixture<SidebarFriendElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarFriendElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarFriendElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

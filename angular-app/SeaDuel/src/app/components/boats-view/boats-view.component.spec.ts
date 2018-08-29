import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatsViewComponent } from './boats-view.component';

describe('BoatsViewComponent', () => {
  let component: BoatsViewComponent;
  let fixture: ComponentFixture<BoatsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoatsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoatsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

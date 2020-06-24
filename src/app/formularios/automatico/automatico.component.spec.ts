import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticoComponent } from './automatico.component';

describe('AutomaticoComponent', () => {
  let component: AutomaticoComponent;
  let fixture: ComponentFixture<AutomaticoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomaticoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

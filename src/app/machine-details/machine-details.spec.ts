import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineDetails } from './machine-details';

describe('MachineDetails', () => {
  let component: MachineDetails;
  let fixture: ComponentFixture<MachineDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MachineDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

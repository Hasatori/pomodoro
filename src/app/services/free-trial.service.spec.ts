import { TestBed } from '@angular/core/testing';

import { FreeTrialService } from './free-trial.service';

describe('FreeTrialService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FreeTrialService = TestBed.get(FreeTrialService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { UserServiceProvider } from './user-service-provider';

describe('UserServiceProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserServiceProvider = TestBed.get(UserServiceProvider);
    expect(service).toBeTruthy();
  });
});

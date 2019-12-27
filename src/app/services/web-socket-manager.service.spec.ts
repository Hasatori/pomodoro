import { TestBed } from '@angular/core/testing';

import { WebSocketManagerService } from './web-socket-manager.service';

describe('WebSocketManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebSocketManagerService = TestBed.get(WebSocketManagerService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { WebSocketProxyService } from './web-socket-proxy.service';

describe('WebSocketProxyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebSocketProxyService = TestBed.get(WebSocketProxyService);
    expect(service).toBeTruthy();
  });
});

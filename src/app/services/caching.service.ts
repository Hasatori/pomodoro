import {Injectable} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class CachingService {

  private imageCacheSize: number = 100;
  private cachedImages: Map<string, any> = new Map<string, any>();


  constructor() {
  }

  cacheImage(url: string, image: SafeHtml) {
    if (this.cachedImages.size >= this.imageCacheSize) {
      this.cachedImages.delete(this.cachedImages.keys().next().value);
    }
    this.cachedImages.set(url, image);
  }

  getImageFromCache(url: string): SafeHtml {
    return this.cachedImages.get(url);
  }
}

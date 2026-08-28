import { describe, expect, it } from 'vitest';
import { resolvePublicPath } from './publicPath';

describe('resolvePublicPath', () => {
  it('places root-relative assets under a GitHub Pages repository path', () => {
    expect(resolvePublicPath('/audio/nino.mp3', '/hola-spanish/')).toBe('/hola-spanish/audio/nino.mp3');
    expect(resolvePublicPath('/assets/lolo-guide.jpg', '/hola-spanish/')).toBe('/hola-spanish/assets/lolo-guide.jpg');
  });

  it('keeps root deployment paths rooted once', () => {
    expect(resolvePublicPath('/audio/nino.mp3', '/')).toBe('/audio/nino.mp3');
  });
});

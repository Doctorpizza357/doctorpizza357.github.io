import { describe, it, expect } from 'vitest';

describe('Project setup', () => {
  it('should have vitest configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should resolve path aliases', async () => {
    const App = await import('@/App');
    expect(App.default).toBeDefined();
  });
});

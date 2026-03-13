import '@testing-library/jest-dom';

// Mark that we're in a test environment
(window as any).__VITEST_ENVIRONMENT__ = true;

// Mock matchMedia for GSAP ScrollTrigger in tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

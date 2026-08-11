import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { useLazyLoad } from '../../hooks/useLazyLoad';

describe('useLazyLoad', () => {
  let observeCallbacks: Map<Element, (entries: IntersectionObserverEntry[]) => void>;
  let disconnectMock: ReturnType<typeof vi.fn>;
  let MockIntersectionObserver: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    observeCallbacks = new Map();
    disconnectMock = vi.fn();

    MockIntersectionObserver = vi.fn((callback: (entries: IntersectionObserverEntry[]) => void) => ({
      observe: vi.fn((el: Element) => {
        observeCallbacks.set(el, callback);
      }),
      unobserve: vi.fn(),
      disconnect: disconnectMock,
    }));

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper component that uses the hook and exposes its state
  function TestComponent({ options = {} }: { options?: Parameters<typeof useLazyLoad>[0] }) {
    const { ref, isVisible } = useLazyLoad<HTMLDivElement>(options);
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} data-testid="lazy-container">
        {isVisible ? <span data-testid="content">Loaded</span> : <span data-testid="placeholder">Waiting</span>}
      </div>
    );
  }

  it('starts with isVisible false when IntersectionObserver is available', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('sets isVisible to true when element intersects', () => {
    render(<TestComponent />);

    const container = screen.getByTestId('lazy-container');
    const callback = observeCallbacks.get(container);
    expect(callback).toBeDefined();

    // Simulate intersection
    React.act(() => {
      callback!([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('shows content immediately when disabled is true', () => {
    render(<TestComponent options={{ disabled: true }} />);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('shows content immediately when IntersectionObserver is not available', () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    render(<TestComponent />);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('disconnects observer once element becomes visible', () => {
    render(<TestComponent />);

    const container = screen.getByTestId('lazy-container');
    const callback = observeCallbacks.get(container);

    React.act(() => {
      callback!([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(disconnectMock).toHaveBeenCalled();
  });

  it('does not set isVisible when element is not intersecting', () => {
    render(<TestComponent />);

    const container = screen.getByTestId('lazy-container');
    const callback = observeCallbacks.get(container);

    React.act(() => {
      callback!([{ isIntersecting: false } as IntersectionObserverEntry]);
    });

    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('uses custom rootMargin option', () => {
    render(<TestComponent options={{ rootMargin: '500px' }} />);

    expect(MockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ rootMargin: '500px' })
    );
  });

  it('uses default rootMargin of 200px', () => {
    render(<TestComponent />);

    expect(MockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ rootMargin: '200px' })
    );
  });

  it('cleans up observer on unmount', () => {
    const { unmount } = render(<TestComponent />);
    unmount();
    expect(disconnectMock).toHaveBeenCalled();
  });

  it('returns a ref object from renderHook', () => {
    const { result } = renderHook(() => useLazyLoad<HTMLDivElement>());
    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull();
  });
});

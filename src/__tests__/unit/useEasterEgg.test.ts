import { renderHook, act } from '@testing-library/react';
import { useEasterEgg } from '../../hooks/useEasterEgg';

describe('useEasterEgg', () => {
  function simulateKeySequence(keys: string) {
    for (const key of keys) {
      const event = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
      });
      document.dispatchEvent(event);
    }
  }

  it('returns isTriggered false initially', () => {
    const { result } = renderHook(() => useEasterEgg());
    expect(result.current.isTriggered).toBe(false);
  });

  it('triggers when "pizza" is typed', () => {
    const { result } = renderHook(() => useEasterEgg());

    act(() => {
      simulateKeySequence('pizza');
    });

    expect(result.current.isTriggered).toBe(true);
  });

  it('triggers when "pizza" is typed with preceding characters', () => {
    const { result } = renderHook(() => useEasterEgg());

    act(() => {
      simulateKeySequence('hellopizza');
    });

    expect(result.current.isTriggered).toBe(true);
  });

  it('does not trigger with incomplete sequence', () => {
    const { result } = renderHook(() => useEasterEgg());

    act(() => {
      simulateKeySequence('pizz');
    });

    expect(result.current.isTriggered).toBe(false);
  });

  it('does not trigger with wrong sequence', () => {
    const { result } = renderHook(() => useEasterEgg());

    act(() => {
      simulateKeySequence('pasta');
    });

    expect(result.current.isTriggered).toBe(false);
  });

  it('is case-insensitive', () => {
    const { result } = renderHook(() => useEasterEgg());

    act(() => {
      simulateKeySequence('PIZZA');
    });

    expect(result.current.isTriggered).toBe(true);
  });

  it('can be dismissed via dismiss()', () => {
    const { result } = renderHook(() => useEasterEgg());

    act(() => {
      simulateKeySequence('pizza');
    });
    expect(result.current.isTriggered).toBe(true);

    act(() => {
      result.current.dismiss();
    });
    expect(result.current.isTriggered).toBe(false);
  });

  it('can be dismissed by pressing Escape', () => {
    const { result } = renderHook(() => useEasterEgg());

    act(() => {
      simulateKeySequence('pizza');
    });
    expect(result.current.isTriggered).toBe(true);

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      document.dispatchEvent(event);
    });
    expect(result.current.isTriggered).toBe(false);
  });

  it('can be dismissed by clicking', () => {
    const { result } = renderHook(() => useEasterEgg());

    act(() => {
      simulateKeySequence('pizza');
    });
    expect(result.current.isTriggered).toBe(true);

    act(() => {
      const event = new MouseEvent('click', { bubbles: true });
      document.dispatchEvent(event);
    });
    expect(result.current.isTriggered).toBe(false);
  });

  it('can be re-triggered after dismiss', () => {
    const { result } = renderHook(() => useEasterEgg());

    act(() => {
      simulateKeySequence('pizza');
    });
    expect(result.current.isTriggered).toBe(true);

    act(() => {
      result.current.dismiss();
    });
    expect(result.current.isTriggered).toBe(false);

    act(() => {
      simulateKeySequence('pizza');
    });
    expect(result.current.isTriggered).toBe(true);
  });

  it('ignores keys with modifier keys pressed', () => {
    const { result } = renderHook(() => useEasterEgg());

    act(() => {
      // Simulate "pizza" but with Ctrl held on each key
      for (const key of 'pizza') {
        const event = new KeyboardEvent('keydown', {
          key,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      }
    });

    expect(result.current.isTriggered).toBe(false);
  });

  it('ignores non-printable keys (e.g., Shift, Enter)', () => {
    const { result } = renderHook(() => useEasterEgg());

    act(() => {
      // Type "pi" then some non-printable keys, then "zza"
      simulateKeySequence('pi');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', bubbles: true }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      simulateKeySequence('zza');
    });

    expect(result.current.isTriggered).toBe(true);
  });

  it('cleans up event listeners on unmount', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useEasterEgg());

    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});

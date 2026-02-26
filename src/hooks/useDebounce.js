import { useEffect, useState } from 'react';

/**
 * Returns a debounced version of `value` that only updates
 * after `delay` ms of inactivity.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debouncedValue;
}

import LiveData from './live-data';
import { useEffect, useState } from 'react';

/**
 * ### useLiveData hook adapter
 *
 * The responsibility of this hook is to integrate the `LiveData` with the
 * `react` library. In this way we decouple the lib or framework from our
 * app.
 *
 * @author <pino0071@gmail.com> Jose Aburto
 */
export default function useLiveData<T, K extends LiveData<T>>(viewModel: K): { state: T } {
  const [state, setState] = useState<T>(viewModel.getSubject());

  useEffect(() => {
    const off = viewModel.addSubscribe((newState: T) => setState((pre) => ({ ...pre, ...newState })));
    return () => {
      off();
    };
  }, [viewModel]);

  return { state };
}

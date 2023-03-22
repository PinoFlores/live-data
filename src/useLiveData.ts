import LiveData from './live-data';
import { useEffect, useState } from 'react';

/**
 * ### useLiveData hook adapter
 *
 * This is a `reactive` data that notify its changes to every
 * piece of code observing it. So in other words, this is
 * an `observable data`.
 *
 * The responsibility of this hook is:
 * 1. Integrate `ViewModel`s with `React` ecosystem.
 * 2. Expose immutable state
 * 3. Expose mutating API (that comes from the `ViewModel`) to mutate the state.
 * 4. And last but not least, decoupling `React` (Presenters) library from `logic` (Logic).
 *
 * @author <pino0071@gmail.com> Jose Aburto
 */
export default function useLiveData<T, V, K extends LiveData<T> = LiveData<T>>(liveData: K, viewModel: V): UseLiveData<T, V> {
  const [state, setState] = useState<T>(liveData.getSubject());

  useEffect(() => {
    const off = liveData.addSubscribe((newState: T) => setState((pre) => ({ ...pre, ...newState })));
    return () => {
      off();
    };
  }, [viewModel]);

  return { state, action: viewModel };
}

export type UseLiveData<T, V> = {
  state: T;
  action: V;
};

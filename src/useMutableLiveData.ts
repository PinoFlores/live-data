import { useEffect, useState } from 'react';
import MutableLiveData from './mutable-live-data';

/**
 * ### useMutableLiveData hook adapter
 *
 * The responsibility of this hook is to integrate the `LiveData` with the
 * `react` library. In this way we decouple the lib or framework from our
 * app.
 *
 * @author <pino0071@gmail.com> Jose Aburto
 */
export default function useMutableLiveData<T, V, K extends MutableLiveData<T> = MutableLiveData<T>>(mutableLiveData: K, viewModel: V): UseuseMutableLiveData<T, V> {
  const [state, setState] = useState<T>(mutableLiveData.getSubject());

  useEffect(() => {
    setState;
    const off = mutableLiveData.addSubscribe((newState: T) => setState((pre) => ({ ...pre, ...newState })));
    return () => {
      off();
    };
  }, [viewModel]);

  return { state, action: viewModel };
}

export type UseuseMutableLiveData<T, V> = {
  state: T;
  action: V;
};

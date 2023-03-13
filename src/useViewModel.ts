import ViewModel from './view-model';
import { useEffect, useState } from 'react';

/**
 * ### useViewModel hook adapter
 *
 * The responsibility of this hook is to integrate the `ViewModel` with the
 * `react` library. In this way we decouple the lib or framework from our
 * app.
 *
 * @author <pino0071@gmail.com> Jose Aburto
 */
export default function useViewModel<T, K extends ViewModel<T>>(
  viewModel: K
): UiViewModel<T, K> {
  const [state, setState] = useState<T>(viewModel.getSubject());

  useEffect(() => {
    const off = viewModel.addSubscribe((newState: T) =>
      setState((pre) => ({ ...pre, ...newState }))
    );
    return () => {
      off();
    };
  }, [viewModel]);

  return { state, action: viewModel };
}

export type UiViewModel<T, K extends ViewModel<T>> = {
  state: T;
  action: Omit<K, 'getSubject' | 'addSubscribe' | 'setSubject'>;
};

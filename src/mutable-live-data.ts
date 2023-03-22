import LiveData from './live-data';

export type DispatchStateChange<T> = (pre: T) => T;

/**
 * ### MutableLiveData
 *
 * ```js
 * class MutableLiveData<T> extends LiveData<T>
 * ```
 *
 * This is an observable data structure, that was designed
 * to wrap any other data structure and make it observable.
 * So because of that, when its state change, that new change
 * will be notified to all subscrited observers.
 *
 * This is possible by using an extention or base principle of
 * the [@joseaburt/event-bus](https://github.com/PinoFlores/event-bus)
 * that is not more than the `Observer Pattern` adaptation in combination
 * with a bus.
 *
 * The idea was for decoupling logic from the any framework or
 * UI library, in this case from `React.js` library.
 *
 * This idea was also inspired from `Android Ecosystem Architecture & Design`.
 *
 * @author <pino0071@gmail.com> Jose Aburto
 */
export default class MutableLiveData<T> extends LiveData<T> {
  constructor(initialState: T) {
    super(initialState);
  }

  /**
   * Makes posible the state mutation, and this action need to happen
   * in a controlled scenario, to ensure the inmutability.
   *
   * Here is an example how you need to expose this `MutableLiveData`:
   *
   * ```typescript
   * class LoginViewModel {
   *  private data: MutableLiveData<Credentials>;
   *  public getMutableLiveData(): LiveData<Credentials> {
   *   return this.data;
   *  }
   * }
   * ```
   *
   * Note that the `public getMutableLiveData(): LiveData<Credentials>` method
   * exposes that `state` as immutable, an this is a very important concept because
   * of two important thing: 1. prevent inconsitent state, and 2. ensure reactivity.
   */
  public setSubject(value: T | DispatchStateChange<T>): void {
    if (value instanceof Function) this.subject = value(this.subject);
    else this.subject = value;
    this.notify();
  }
}

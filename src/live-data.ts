export type Subscriber<T> = (newState: T) => void;

/**
 * ### LiveData
 *
 * ```js
 * abstract class LiveData<T>
 * ```
 * This is an observable data structure, that was designed
 * to wrap any other data structure and make it observable.
 * So because of that, when its state change, that new change
 * will be notified to all subscrited observers.
 *
 * Note that this clase expose not mutator functionality, and also
 * is a not instanciable class (because is abstract). The main idea
 * is that this class will be used to provide a type that will be
 * used in two cases:
 * 1. Extentions: You want to create your own impls, like pre-built `MutableLiveData`.
 * 2. Expose immutable data: You want to expose your state/subject as immutable, and provide
 * a common interface to mutate that data.
 *
 * In the example below, we can see `MutableLiveData<Credentials>` which can be mutated, but
 * note that the `public getMutableLiveData(): LiveData<Credentials>` method exposes that `state`
 * as immutable, an this is a very important concept because of two important thing: 1. prevent
 * inconsitent state, and 2. ensure reactivity.
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
export default abstract class LiveData<T> {
  // The Observable State: Subject
  protected subject: T;

  // All Observers that subscribe to any change/updation on the Subject
  protected subscribers: Subscriber<T>[] = [];

  constructor(initialState: T) {
    this.subject = initialState;
  }

  /**
   * Helper to create `Once Subscrition`
   */
  private off(handler: Subscriber<T>): void {
    const index = this.subscribers.indexOf(handler) ?? -1;
    this.subscribers.splice(index >>> 0, 1);
  }

  /**
   * Whenever the subject when we call this function
   * to dispatch a new notification with the new Subject
   * state change. This make the reaction on any state change.
   */
  protected notify(): void {
    for (const handler of this.subscribers) handler(this.subject);
  }

  /**
   * To avoid leaks in some cases
   * we want to remove all references to subscriber
   * handlers and make this instance garbage collected.
   *
   * An use case is when we create an instance of the `LiveData`
   * in some module and we use it inside some `LifeCycle UI Components`
   * on those componenst are unmmount or killed but maybe some other observers
   * like viewmodels are still alive, we can call this to remove all refs.
   */
  public removeSubscribers(): void {
    this.subscribers = [];
  }

  /**
   * Register a new observer, that will be notified when
   * the subject get updated. This registration can happen once if
   * we use the returning function to put `off` the previous one.
   *
   * Example in a `LifeCycle UI Components`.
   *
   * @example
   *
   * function MyComponent(): JSX.Element {
   *  useEffect(() => {
   *    const off = liveData.addSubscribe(() => {...})
   *    return () => { // Called on component unmount.
   *      off() // 👈🏽 Here is how.
   *    }
   *   }, [])
   * }
   */
  public addSubscribe(handler: Subscriber<T>): Function {
    if (typeof handler !== 'function') throw new Error('InvalidEventHandlerType');
    this.subscribers.push(handler);
    return () => this.off(handler);
  }

  /**
   * Get the subject/data.
   *
   * Even if the `ViewModel`s you exposes `subject/data`
   * as `LiveData`, we also have `MutableLiveData` that
   * extends from this base class, so for avoiding direct
   * mutations, we return a cloned version of that `subject/data`
   * to prevent inconsistent states. Any intent of mutate directly
   * it will not have any reactive effect and also won't mutate the
   * state.
   */
  public getSubject(): T {
    return Object.assign({}, this.subject);
  }
}

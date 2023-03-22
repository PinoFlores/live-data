export type Subscriber<T> = (newState: T) => void;

export default class LiveData<T> {
  protected subject: T;
  protected subscribers: Subscriber<T>[] = [];

  constructor(initialState: T) {
    this.subject = initialState;
  }

  private off(handler: Subscriber<T>): void {
    const index = this.subscribers.indexOf(handler) ?? -1;
    this.subscribers.splice(index >>> 0, 1);
  }

  public addSubscribe(handler: Subscriber<T>): Function {
    if (typeof handler !== 'function') throw new Error('InvalidEventHandlerType');
    this.subscribers.push(handler);
    return () => this.off(handler);
  }

  public removeSubscribers(): void {
    this.subscribers = [];
  }

  protected notify(): void {
    for (const handler of this.subscribers) handler(this.subject);
  }

  public getSubject(): T {
    return Object.assign({}, this.subject);
  }
}

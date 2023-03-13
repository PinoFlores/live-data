export type Subscriber<T> = (newState: T) => void;

export default abstract class ViewModel<T> {
  protected subject: T;
  private subscribers: Subscriber<T>[] = [];

  constructor(subject: T) {
    this.subject = subject;
  }

  private off(handler: Subscriber<T>): void {
    const index = this.subscribers.indexOf(handler) ?? -1;
    this.subscribers.splice(index >>> 0, 1);
  }

  public addSubscribe(handler: Subscriber<T>): Function {
    if (typeof handler !== 'function')
      throw new Error('InvalidEventHandlerType');
    this.subscribers.push(handler);
    return () => this.off(handler);
  }

  protected notify(): void {
    for (const handler of this.subscribers) handler(this.subject);
  }

  protected setSubject(subject: T): void {
    this.subject = subject;
    this.notify();
  }

  public getSubject(): T {
    return Object.assign({}, this.subject);
  }
}

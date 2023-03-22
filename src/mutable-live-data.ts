import LiveData from './live-data';

export type DispatchStateChange<T> = (pre: T) => T;

export default class MutableLiveData<T> extends LiveData<T> {
  constructor(initialState: T) {
    super(initialState);
  }

  public setSubject(value: T | DispatchStateChange<T>): void {
    if (value instanceof Function) this.subject = value(this.subject);
    else this.subject = value;
    this.notify();
  }
}

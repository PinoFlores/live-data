# @joseaburto/live-data

LiveData is an observable data holder class.

```typescript
type Credentials = {
  password: string;
  email: string;
  canSubmit: string;
};

class LoginViewModel extends LiveData<Credentials> {
  private state: LiveData<Credentials>;
  constructor(defaultState: Credentials) {
    super({ ...LoginViewModel.DEFAULT_STATE, ...defaultState });
  }

  public canSubmit(): boolean {
    return this.subject.password !== '' && this.subject.email;
  }

  public submit();
}
```

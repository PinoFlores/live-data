# @joseaburto/live-data

### Philosophy

Let's try to put `React.js` in its place: Library to create user interfaces.

---

**LiveData** is an observable data holder class.

This is an observable data structure, that was designed to wrap any other data structure and make it observable.
So because of that, when its state change, that new change will be notified to all subscrited observers.

Note that this clase expose not mutator functionality, and also is a not instanciable class (because is abstract). The main idea is that this class will be used to provide a type that will be used in two cases:

1.  **Extentions**: You want to create your own impls, like pre-built `MutableLiveData`.
2.  **Expose immutable data**: You want to expose your state/subject as immutable, and provide a common interface to mutate that data.

In the example below, we can see `MutableLiveData<Credentials>` which can be mutated, but
note that the `public getMutableLiveData(): LiveData<Credentials>` method exposes that `state`
as immutable because `LiveData` is immutable, an this is a very important concept because of two important thing:

1. prevent inconsitent state, and
2. ensure reactivity.

```typescript
class LoginViewModel {
  private data: MutableLiveData<Credentials>;
  public getMutableLiveData(): LiveData<Credentials> {
    return this.data;
  }
}
```

This is possible by using an extention or base principle of the [@joseaburt/event-bus](https://github.com/PinoFlores/event-bus) that is not more than the `Observer Pattern` adaptation in combination with a bus.

The idea was for decoupling logic from the any framework or UI library, in this case from `React.js` library.

This idea was also inspired from `Android Ecosystem Architecture & Design`.

## Example

```typescript
// Our data to observe
type Credentials = {
  email: string;
  password: string;
};

// Our simple ViewModel
class LoginViewModel {
  private data: MutableLiveData<Credentials>;

  constructor() {
    this.data = new MutableLiveData({ email: '', password: '' });
  }

  public setData(creds: Credentials): void {
    this.data.setSubject(creds);
  }

  public getMutableLiveData(): LiveData<Credentials> {
    return this.data;
  }
}

// ============================================
// Presentation Layer: A simple Form component
// ============================================

// Component Props
interface LoginFormProps {
  state: Credentials;
  setState: (newState: Credentials) => void;
}

// Component that only take care of print view in screen
const Form = (props: LoginFormProps): JSX.Element => {
  const handleOnChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    props.setState({ ...props.state, [name]: value });
  };

  return (
    <form>
      <label htmlFor="email" children="Email" />
      <input name="email" id="email" type="email" value={props.state.email} onChange={handleOnChange} />
      <label htmlFor="password" children="Password" />
      <input name="password" id="password" type="password" value={props.state.password} onChange={handleOnChange} />
    </form>
  );
};

// Some adapter component to integrate/join the ViewModel and the Presenter
function withLoginViewModel(Component: React.ComponentType<LoginFormProps>, viewModel: LoginViewModel): React.ComponentType<{}> {
  return function (): JSX.Element {
    const { state, action } = useMutableLiveData<Credentials, LoginViewModel>(viewModel.getMutableLiveData(), viewModel);
    return <Component state={state} setState={(creds: Credentials) => action.setData(creds)} />;
  };
}
```

### We can act ever, without needed a UI component.

```typescript
test('should set new data and update subscribers when using viewModel directly', async () => {
  render(<MyLoginForm />);

  expect(screen.getByLabelText('Email')).toHaveValue('');
  expect(screen.getByLabelText('Password')).toHaveValue('');

  const newCreds: Credentials = { password: '1234', email: 'pepe@gmail.com' };

  act(() => {
    // We are acting using directly the instance of the viewModel that acts as a manager for the data.
    loginViewModel.setData(newCreds);
  });

  await waitFor(() => {
    expect(screen.getByLabelText('Email')).toHaveValue(newCreds.email);
  });

  expect(screen.getByLabelText('Password')).toHaveValue(newCreds.password);
});

// or using components

test('should set new data and update subscribers when using a ui component', async () => {
  render(<MyLoginForm />);

  const emailField = screen.getByLabelText('Email');
  const passwordField = screen.getByLabelText('Password');

  expect(emailField).toHaveValue('');
  expect(passwordField).toHaveValue('');

  // Updating Email Form Field & asserting new state change
  const newEmailValue = 'juana.la.cubana@gmail.com';
  useEvent.type(emailField, newEmailValue);
  await waitFor(() => {
    expect(emailField).toHaveValue(newEmailValue);
  });

  // Updating Password Form Field & asserting new state change
  const newPasswordValue = 'juana.la.cubana@gmail.com';
  useEvent.type(passwordField, newPasswordValue);
  await waitFor(() => {
    expect(passwordField).toHaveValue(newPasswordValue);
  });
});
```

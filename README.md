# @joseaburto/live-data

LiveData is an observable data holder class.

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

  public getMutableLiveData(): MutableLiveData<Credentials> {
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

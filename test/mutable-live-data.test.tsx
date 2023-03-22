import React from 'react';
import '@testing-library/jest-dom';
import useEvent from '@testing-library/user-event';
import { MutableLiveData, useLiveData, LiveData } from '../src';
import { render, waitFor, screen, act } from '@testing-library/react';

// Our data to observe
type Credentials = {
  email: string;
  password: string;
};

// Our simple ViewModel
class LoginViewModel {
  private data: MutableLiveData<Credentials>;

  // ⚠️ Expose you data as immuntable. Expose your mutators func in your viewmodel to mutate the data.
  public getMutableLiveData(): LiveData<Credentials> {
    return this.data;
  }

  constructor() {
    this.data = new MutableLiveData({ email: '', password: '' });
  }

  public setData(creds: Credentials): void {
    this.data.setSubject(creds);
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
    const { state, action } = useLiveData<Credentials, LoginViewModel>(viewModel.getMutableLiveData(), viewModel);
    return <Component state={state} setState={(creds: Credentials) => action.setData(creds)} />;
  };
}

// Our tests!
describe('MutableLiveData', () => {
  let loginViewModel: LoginViewModel;
  let MyLoginForm: React.ComponentType<{}>;

  beforeEach(() => {
    loginViewModel = new LoginViewModel();
    MyLoginForm = withLoginViewModel(Form, loginViewModel);
  });

  test('should set new data and update subscribers when using viewModel directly', async () => {
    render(<MyLoginForm />);

    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByLabelText('Password')).toHaveValue('');

    const newCreds: Credentials = { password: '1234', email: 'pepe@gmail.com' };

    act(() => {
      loginViewModel.setData(newCreds);
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toHaveValue(newCreds.email);
    });

    expect(screen.getByLabelText('Password')).toHaveValue(newCreds.password);
  });

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
});

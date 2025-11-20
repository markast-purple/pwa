import '../App.css';

type LoginScreenProps = {
  username: string;
  onUsernameChange: (value: string) => void;
  onContinue: () => void;
};

const LoginScreen = ({ username, onUsernameChange, onContinue }: LoginScreenProps) => {
  return (
    <section className="surface">
      <h3>Step 1</h3>
      <h1>Sign in to Push Console</h1>
      <p>Enter your username to continue with multi-factor authentication.</p>

      <div className="form-stack">
        <input
          className="input-field"
          placeholder="Enter username"
          value={username}
          onChange={(event) => onUsernameChange(event.target.value)}
        />
        <button className="primary-button" onClick={onContinue} disabled={!username.trim()}>
          Continue
        </button>
      </div>
    </section>
  );
};

export default LoginScreen;


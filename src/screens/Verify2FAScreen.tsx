import '../App.css';

type Verify2FAScreenProps = {
  token: string;
  onTokenChange: (value: string) => void;
  onVerify: () => void;
};

const Verify2FAScreen = ({ token, onTokenChange, onVerify }: Verify2FAScreenProps) => {
  return (
    <section className="surface">
      <h3>Step 2</h3>
      <h1>Enter Authenticator Code</h1>
      <p>Open your authenticator app and type the current 6-digit code.</p>

      <div className="form-stack">
        <input
          className="input-field"
          placeholder="Enter 6-digit code"
          value={token}
          onChange={(event) => onTokenChange(event.target.value)}
        />
        <button className="primary-button" onClick={onVerify} disabled={token.trim().length < 6}>
          Verify and Sign In
        </button>
      </div>
    </section>
  );
};

export default Verify2FAScreen;


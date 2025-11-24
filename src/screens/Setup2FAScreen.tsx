import { useState } from 'react';
import '../App.css';

type Setup2FAScreenProps = {
  qrCode?: string | null;
  secret?: string | null;
  otpUri?: string | null;
  token: string;
  onTokenChange: (value: string) => void;
  onVerify: () => void;
};


const Setup2FAScreen = ({ qrCode, secret, otpUri, token, onTokenChange, onVerify }: Setup2FAScreenProps) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleCopySecret = async () => {
    if (!secret) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(secret);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = secret;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to copy secret', error);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const handleOpenAuthenticator = () => {
    if (!otpUri) {
      return;
    }

    const target = otpUri;
    window.location.href = target;
  };

  return (
    <section className="surface">
      <h3>Step 2</h3>
      <h1>Secure Your Account</h1>
      <p>
        Scan the QR code with Google Authenticator or copy the secret manually. Then enter the 6-digit
        code below.
      </p>

      {qrCode && <img className="qr-code" src={qrCode} alt="Authenticator QR code" />}

      {secret && (
        <div className="panel">
          <h4>Manual entry</h4>
          <p className="helper-text">Use this secret if you cannot scan the QR code on this device.</p>
          <code className="secret-chip">{secret}</code>
          <div className="panel-actions">
            <button type="button" className="secondary-button" onClick={handleCopySecret}>
              {copyStatus === 'copied' ? 'Copied!' : 'Copy secret'}
            </button>
            {otpUri && (
              <button type="button" className="ghost-button" onClick={handleOpenAuthenticator}>
                Open authenticator app
              </button>
            )}
          </div>
          {copyStatus === 'error' && <p className="error-text">Unable to copy. Please copy manually.</p>}
        </div>
      )}

      <div className="form-stack">
        <input
          className="input-field"
          placeholder="Enter 6-digit code"
          value={token}
          onChange={(event) => onTokenChange(event.target.value)}
        />
        <button className="primary-button" onClick={onVerify} disabled={token.trim().length < 6}>
          Verify and Continue
        </button>
      </div>
    </section>
  );
};

export default Setup2FAScreen;


import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import LoginScreen from './screens/LoginScreen.tsx';
import Setup2FAScreen from './screens/Setup2FAScreen.tsx';
import Verify2FAScreen from './screens/Verify2FAScreen.tsx';
import DashboardScreen from './screens/DashboardScreen.tsx';
import { useAuthFlow } from './hooks/useAuthFlow.ts';
import { ROUTES } from './constants/routes.ts';
import { usePwaInstallPrompt } from './hooks/usePwaInstallPrompt.ts';

function App() {
  const location = useLocation();
  const {
    accessToken,
    username,
    setUsername,
    token,
    setToken,
    qrCode,
    tempSecret,
    otpUri,
    isSubscribed,
    hasSetupContext,
    handleLogin,
    handleVerify,
    handleLogout,
    subscribeToPush,
    triggerNotification,
  } = useAuthFlow({ isDashboardActive: location.pathname === ROUTES.dashboard });
  const {
    showAndroidPrompt,
    showIOSInstructions,
    promptInstall,
    dismissAndroidPrompt,
    dismissIOSInstructions,
  } = usePwaInstallPrompt();

  return (
    <main className="app-shell">
      <Routes>
        <Route path={ROUTES.root} element={<Navigate to={ROUTES.login} replace />} />
        <Route
          path={ROUTES.login}
          element={
            accessToken ? (
              <Navigate to={ROUTES.dashboard} replace />
            ) : (
              <LoginScreen username={username} onUsernameChange={setUsername} onContinue={handleLogin} />
            )
          }
        />
        <Route
          path={ROUTES.setup2FA}
          element={
            !hasSetupContext ? (
              <Navigate to={ROUTES.login} replace />
            ) : (
              <Setup2FAScreen
                qrCode={qrCode}
                secret={tempSecret}
                otpUri={otpUri}
                token={token}
                onTokenChange={setToken}
                onVerify={handleVerify}
              />
            )
          }
        />
        <Route
          path={ROUTES.verify2FA}
          element={
            !username ? (
              <Navigate to={ROUTES.login} replace />
            ) : (
              <Verify2FAScreen token={token} onTokenChange={setToken} onVerify={handleVerify} />
            )
          }
        />
        <Route
          path={ROUTES.dashboard}
          element={
            accessToken ? (
              <DashboardScreen
                username={username}
                isSubscribed={isSubscribed}
                onSubscribe={subscribeToPush}
                onSendNotification={triggerNotification}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to={ROUTES.login} replace />
            )
          }
        />
        <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
      </Routes>

      {showAndroidPrompt && (
        <div className="modal-backdrop">
          <section className="modal">
            <h3>Add to Home Screen</h3>
            <p>Add this app to your Android home screen for a full-screen experience.</p>
            <div className="modal-actions">
              <button className="primary-button" onClick={promptInstall}>
                Install
              </button>
              <button className="ghost-button" onClick={dismissAndroidPrompt}>
                Maybe later
              </button>
            </div>
          </section>
        </div>
      )}

      {showIOSInstructions && (
        <div className="modal-backdrop">
          <section className="modal">
            <h3>Add to Home Screen</h3>
            <p>On iOS, install this app manually:</p>
            <ol>
              <li>Tap the Share icon in Safari.</li>
              <li>Select “Add to Home Screen”.</li>
              <li>Confirm by tapping Add.</li>
            </ol>
            <button className="primary-button" onClick={dismissIOSInstructions}>
              Got it
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;

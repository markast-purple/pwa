import '../App.css';

type DashboardScreenProps = {
  username: string;
  isSubscribed: boolean;
  onSubscribe: () => void;
  onSendNotification: () => void;
  onSendDelayedNotification: () => void;
  onLogout: () => void;
};

const DashboardScreen = ({
  username,
  isSubscribed,
  onSubscribe,
  onSendNotification,
  onSendDelayedNotification,
  onLogout,
}: DashboardScreenProps) => {
  return (
    <section className="surface">
      <h3>Dashboard</h3>
      <h1>Welcome back, {username || 'friend'} 👋</h1>
      <p>You are signed in with strong authentication. Manage your push targets below.</p>

      <div className="panel">
        <h4>Notifications</h4>
        <p className="helper-text">
          Subscribe your device to receive Web Push notifications powered by VAPID keys.
        </p>
        <div className="panel-actions">
          <button className="primary-button" onClick={onSubscribe} disabled={isSubscribed}>
            {isSubscribed ? 'You are already subscribed' : 'Enable push notifications'}
          </button>
          <button className="secondary-button" onClick={onSendNotification} disabled={!isSubscribed}>
            Send test notification
          </button>
          <button className="ghost-button" onClick={onSendDelayedNotification} disabled={!isSubscribed}>
            Send delayed notification (30s)
          </button>
        </div>
      </div>

      <button className="ghost-button" onClick={onLogout}>
        Sign out
      </button>
    </section>
  );
};

export default DashboardScreen;


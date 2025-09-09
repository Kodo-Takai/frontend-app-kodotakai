import AuthLayout from './components/AuthLayout';
import Login from './pages/Login';

export default function App() {
  return (
    <div>
      <AuthLayout>
        <Login />
      </AuthLayout>
    </div>
  );
}

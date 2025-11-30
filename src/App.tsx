import HUD from './components/HUD';
import Login from './components/Login';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading } = useAuth();
  if (loading) return null; // Opcional: puedes renderizar un spinner
  return user ? <HUD /> : <Login />;
}

export default App;

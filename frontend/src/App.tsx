import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Groups from './components/Groups';
import Expenses from './components/Expenses';
import Balances from './components/Balances';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/balances" element={<Balances />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

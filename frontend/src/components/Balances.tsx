import { useState, useEffect } from 'react';
import { userService, settlementService } from '../services/api';
import type { User, Balance } from '../types';
import { IndianRupee, Loader, AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';


export default function Balances() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settling, setSettling] = useState(false);
  const [settlementData, setSettlementData] = useState({
    toUserId: '',
    amount: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBalances = async (userId: string) => {
    if (!userId) return;

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await userService.getUserBalances(parseInt(userId));
      setBalances(data);
    } catch (err) {
      setError('Failed to fetch balances. Please try again.');
      setBalances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    setSettlementData({ toUserId: '', amount: '' });
    if (userId) {
      fetchBalances(userId);
    } else {
      setBalances([]);
    }
  };

  const handleSettle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !settlementData.toUserId || !settlementData.amount) {
      setError('Please fill in all settlement fields');
      return;
    }

    const amount = parseFloat(settlementData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setSettling(true);
    setError('');
    setSuccess('');
    try {
      await settlementService.settleBalance({
        fromUserId: parseInt(selectedUserId),
        toUserId: parseInt(settlementData.toUserId),
        amount: amount,
      });

      setSuccess('Balance settled successfully!');
      setSettlementData({ toUserId: '', amount: '' });
      await fetchBalances(selectedUserId);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to settle balance. Please try again.');
    } finally {
      setSettling(false);
    }
  };

  const owedBalances = balances.filter((b) => b.type === 'OWED');
  const oweBalances = balances.filter((b) => b.type === 'OWE');
  const totalOwed = owedBalances.reduce((sum, b) => sum + b.amount, 0);
  const totalOwe = oweBalances.reduce((sum, b) => sum + b.amount, 0);
  const netBalance = totalOwed - totalOwe;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Balance Tracking</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-start">
          <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select User to View Balances
        </label>
        <select
          value={selectedUserId}
          onChange={(e) => handleUserChange(e.target.value)}
          className="max-w-md w-full px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Choose a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {loading && !settling ? (
        <Loader className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
      ) : selectedUserId && balances.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 shadow rounded">
              <p>You Are Owed</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{totalOwed.toFixed(2)}
              </p>
            </div>

            <div className="bg-white p-6 shadow rounded">
              <p>You Owe</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{totalOwe.toFixed(2)}
              </p>
            </div>

            <div className="bg-white p-6 shadow rounded">
              <p>Net Balance</p>
              <p className={`text-2xl font-bold ₹{netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netBalance >= 0 ? '+' : '-'}₹{Math.abs(netBalance).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 shadow rounded">
              <h2 className="font-semibold mb-4 flex items-center">
                <TrendingUp className="mr-2 text-green-600" /> People Who Owe You
              </h2>
              {owedBalances.map((b) => (
                <div key={b.userId} className="flex justify-between p-3 bg-green-50 rounded mb-2">
                  <span>{b.userName}</span>
                  <span className="font-bold text-green-600">₹{b.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 shadow rounded">
              <h2 className="font-semibold mb-4 flex items-center">
                <TrendingDown className="mr-2 text-red-600" /> People You Owe
              </h2>
              {oweBalances.map((b) => (
                <div key={b.userId} className="flex justify-between p-3 bg-red-50 rounded mb-2">
                  <span>{b.userName}</span>
                  <span className="font-bold text-red-600">₹{b.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-white p-6 shadow rounded">
            <h2 className="font-semibold mb-4">Settle Balance</h2>
            <form onSubmit={handleSettle} className="space-y-4">
              <select
                value={settlementData.toUserId}
                onChange={(e) =>
                  setSettlementData({ ...settlementData, toUserId: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">Select person</option>
                {balances.map((b) => (
                  <option key={b.userId} value={b.userId}>
                    {b.userName} ({b.type === 'OWE' ? 'You owe' : 'Owes you'} ₹{b.amount.toFixed(2)})
                  </option>
                ))}
              </select>

              <input
                type="number"
                step="0.01"
                value={settlementData.amount}
                onChange={(e) =>
                  setSettlementData({ ...settlementData, amount: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
                placeholder="₹0.00"
              />

              <button
                type="submit"
                disabled={settling}
                className="w-full bg-purple-600 text-white py-2 rounded"
              >
                {settling ? 'Settling...' : 'Settle Balance'}
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
  <IndianRupee className="w-16 h-16 mx-auto mb-4 text-gray-400" />
  <p className="text-gray-500 text-lg">Select a user to view balances</p>
</div>
      )}
    </div>
  );
}

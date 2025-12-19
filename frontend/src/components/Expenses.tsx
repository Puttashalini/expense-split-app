import { useState, useEffect } from 'react';
import { expenseService, groupService, userService } from '../services/api';
import type { Group, User } from '../types';
import { Receipt, Loader, AlertCircle, CheckCircle } from 'lucide-react';

type SplitType = 'EQUAL' | 'EXACT' | 'PERCENTAGE';

interface SplitData {
  userId: number;
  amount?: number;
  percentage?: number;
}

/* ✅ INR formatter (display only) */
const formatINR = (amount: number) =>
  amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

export default function Expenses() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    groupId: '',
    description: '',
    amount: '',
    paidBy: '',
    splitType: 'EQUAL' as SplitType,
  });

  const [splits, setSplits] = useState<SplitData[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [groupsData, usersData] = await Promise.all([
        groupService.getAllGroups(),
        userService.getAllUsers(),
      ]);
      setGroups(groupsData);
      setUsers(usersData);
    } catch {
      setError('Failed to fetch data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getGroupMembers = () => {
    if (!formData.groupId) return [];
    const group = groups.find((g) => g.id === Number(formData.groupId));
    return group ? users.filter((u) => group.memberIds.includes(u.id)) : [];
  };

  const handleGroupChange = (groupId: string) => {
    setFormData({ ...formData, groupId, paidBy: '' });
    setSelectedParticipants([]);
    setSplits([]);
  };

  const toggleParticipant = (userId: number) => {
    const updated = selectedParticipants.includes(userId)
      ? selectedParticipants.filter((id) => id !== userId)
      : [...selectedParticipants, userId];

    setSelectedParticipants(updated);

    setSplits(
      updated.map((id) => ({
        userId: id,
        amount: formData.splitType === 'EXACT' ? 0 : undefined,
        percentage: formData.splitType === 'PERCENTAGE' ? 0 : undefined,
      }))
    );
  };

  const updateSplitValue = (userId: number, value: number) => {
    setSplits((prev) =>
      prev.map((s) =>
        s.userId === userId
          ? {
              ...s,
              ...(formData.splitType === 'EXACT'
                ? { amount: value }
                : { percentage: value }),
            }
          : s
      )
    );
  };

  const validateForm = (): boolean => {
  if (!formData.groupId || !formData.description || !formData.amount || !formData.paidBy) {
    setError('Please fill in all required fields');
    return false;
  }

  if (selectedParticipants.length === 0) {
    setError('Please select at least one participant');
    return false;
  }

  // ✅ IMPORTANT FIX
  if (formData.splitType === 'EQUAL' && selectedParticipants.length < 2) {
    setError('Equal split requires at least 2 participants');
    return false;
  }

  const amount = parseFloat(formData.amount);
  if (isNaN(amount) || amount <= 0) {
    setError('Please enter a valid amount in ₹');
    return false;
  }

  if (formData.splitType === 'EXACT') {
    const totalSplit = splits.reduce((sum, s) => sum + (s.amount || 0), 0);
    if (Math.abs(totalSplit - amount) > 0.01) {
      setError(`Split amounts must equal total amount (${formatINR(amount)})`);
      return false;
    }
  }

  if (formData.splitType === 'PERCENTAGE') {
    const totalPercentage = splits.reduce((sum, s) => sum + (s.percentage || 0), 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      setError('Split percentages must equal 100%');
      return false;
    }
  }

  return true;
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await expenseService.createExpense({
        groupId: Number(formData.groupId),
        amount: Number(formData.amount),
        description: formData.description,
        paidBy: Number(formData.paidBy),
        splitType: formData.splitType,
        splits,
      });

      setSuccess(true);
      setFormData({
        groupId: '',
        description: '',
        amount: '',
        paidBy: '',
        splitType: 'EQUAL',
      });
      setSelectedParticipants([]);
      setSplits([]);

      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to create expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const groupMembers = getGroupMembers();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add Expense (₹)</h1>

      <div className="bg-white rounded-lg shadow-md p-6 border">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex">
            <CheckCircle className="w-5 h-5 mr-2" />
            Expense created successfully!
          </div>
        )}

        {loading ? (
          <Loader className="w-8 h-8 animate-spin mx-auto" />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <select
                value={formData.groupId}
                onChange={(e) => handleGroupChange(e.target.value)}
                className="px-4 py-2 border rounded"
              >
                <option value="">Select Group</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                step="0.01"
                placeholder="Amount (₹)"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="px-4 py-2 border rounded"
              />
            </div>

            <input
              type="text"
              placeholder="Expense description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />

            <select
              value={formData.paidBy}
              onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
              className="w-full px-4 py-2 border rounded"
              disabled={!formData.groupId}
            >
              <option value="">Paid By</option>
              {groupMembers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <div className="flex gap-4">
              {(['EQUAL', 'EXACT', 'PERCENTAGE'] as SplitType[]).map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.splitType === type}
                    onChange={() => {
                      setFormData({ ...formData, splitType: type });
                      setSplits(
                        selectedParticipants.map((id) => ({
                          userId: id,
                          amount: type === 'EXACT' ? 0 : undefined,
                          percentage: type === 'PERCENTAGE' ? 0 : undefined,
                        }))
                      );
                    }}
                  />
                  {type}
                </label>
              ))}
            </div>

            <div className="border rounded">
              {groupMembers.map((u) => (
                <div key={u.id} className="flex items-center p-3 border-b last:border-b-0">
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(u.id)}
                    onChange={() => toggleParticipant(u.id)}
                  />
                  <span className="ml-3 flex-1">{u.name}</span>

                  {selectedParticipants.includes(u.id) &&
                    formData.splitType === 'EXACT' && (
                      <input
                        type="number"
                        step="0.01"
                        className="w-24 px-2 py-1 border rounded"
                        value={splits.find((s) => s.userId === u.id)?.amount || ''}
                        onChange={(e) =>
                          updateSplitValue(u.id, parseFloat(e.target.value) || 0)
                        }
                      />
                    )}

                  {selectedParticipants.includes(u.id) &&
                    formData.splitType === 'PERCENTAGE' && (
                      <input
                        type="number"
                        step="0.01"
                        className="w-24 px-2 py-1 border rounded"
                        value={splits.find((s) => s.userId === u.id)?.percentage || ''}
                        onChange={(e) =>
                          updateSplitValue(u.id, parseFloat(e.target.value) || 0)
                        }
                      />
                    )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-600 text-white px-4 py-3 rounded flex justify-center items-center"
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Creating Expense...
                </>
              ) : (
                <>
                  <Receipt className="w-5 h-5 mr-2" />
                  Add Expense
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

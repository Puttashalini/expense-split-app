import { useState, useEffect } from 'react';
import { groupService, userService } from '../services/api';
import type { Group, User } from '../types';
import {
  Layers,
  Users as UsersIcon,
  Loader,
  AlertCircle,
  Plus,
  
} from 'lucide-react';

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<{ name: string; memberIds: number[] }>({
    name: '',
    memberIds: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

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

      // ✅ Normalize API response
      const safeGroups: Group[] = groupsData.map((g: any) => ({
        id: g.id,
        name: g.name ?? '(Unnamed Group)',
        memberIds: g.memberIds ?? [],
      }));

      setGroups(safeGroups);
      setUsers(usersData);
    } catch {
      setError('Failed to fetch data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.memberIds.length === 0) {
      setError('Please provide group name and select at least one member');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await groupService.createGroup({
        name: formData.name.trim(),
        memberIds: formData.memberIds,
      });

      setFormData({ name: '', memberIds: [] });
      await fetchData();
    } catch {
      setError('Failed to create group. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMember = (userId: number) => {
    setFormData((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(userId)
        ? prev.memberIds.filter((id) => id !== userId)
        : [...prev.memberIds, userId],
    }));
  };

  const getUserName = (userId: number) =>
    users.find((u) => u.id === userId)?.name || 'Unknown';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Group Management
      </h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CREATE GROUP */}
        <div className="bg-white rounded-lg shadow-md p-6 border">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-green-600" />
            Create New Group
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Group name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border rounded"
            />

            <div className="border rounded max-h-48 overflow-y-auto">
              {users.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center px-4 py-2 border-b cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.memberIds.includes(user.id)}
                    onChange={() => toggleMember(user.id)}
                  />
                  <span className="ml-3 flex-1">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              {submitting ? 'Creating...' : 'Create Group'}
            </button>
          </form>
        </div>

        {/* LIST GROUPS */}
        <div className="bg-white rounded-lg shadow-md p-6 border">
          <h2 className="text-xl font-semibold mb-4">All Groups</h2>

          {loading ? (
            <Loader className="w-8 h-8 animate-spin mx-auto text-green-600" />
          ) : groups.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Layers className="w-12 h-12 mx-auto mb-3" />
              No groups yet
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="border rounded p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    setSelectedGroup(
                      selectedGroup?.id === group.id ? null : group
                    )
                  }
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold flex items-center">
                      <Layers className="w-4 h-4 mr-2 text-green-600" />
                      {group.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      ID: {group.id}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <UsersIcon className="w-4 h-4 mr-1" />
                    {group.memberIds.length} member
                    {group.memberIds.length !== 1 ? 's' : ''}
                  </div>

                  {selectedGroup?.id === group.id && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs font-medium mb-2">Members:</p>
                      <div className="flex flex-wrap gap-2">
                        {group.memberIds.map((id) => (
                          <span
                            key={id}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {getUserName(id)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

/* ================= USERS ================= */
export const userService = {
  getAllUsers: async () => {
    const res = await api.get('/users');
    return res.data;
  },

  getUserBalances: async (userId: number) => {
    const res = await api.get(`/users/${userId}/balances`);
    return res.data;
  }
};

/* ================= GROUPS ================= */
export const groupService = {
  getAllGroups: () => api.get('/groups').then(res => res.data),

  createGroup: (data: { name: string; memberIds: number[] }) =>
    api.post('/groups', {
      name: data.name,              // ✅ FIX
      memberIds: data.memberIds
    }),
};


/* ================= EXPENSES ================= */
export const expenseService = {
  createExpense: async (data: any) => {
    const res = await api.post('/expenses', data);
    return res.data;
  }
};

/* ================= SETTLEMENT ================= */
export const settlementService = {
  settleBalance: async (data: any) => {
    const res = await api.post('/settle', data);
    return res.data;
  }
};

export default api;

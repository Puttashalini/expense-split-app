export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Group {
  id: number;
  name: string;
  memberIds: number[];
}

export interface Expense {
  id: number;
  groupId: number;
  amount: number;
  description: string;
  paidBy: number;
  splitType: 'EQUAL' | 'EXACT' | 'PERCENTAGE';
  splits: Split[];
}

export interface Split {
  userId: number;
  amount?: number;
  percentage?: number;
}

export interface Balance {
  userId: number;
  userName: string;
  amount: number;
  type: 'OWE' | 'OWED';
}

export interface Settlement {
  fromUserId: number;
  toUserId: number;
  amount: number;
}

import { v4 as uuidv4 } from 'uuid';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
}

export function createTransaction(
  partial: Partial<Transaction> = {}
): Transaction {
  return {
    id: partial.id || uuidv4(),
    name: partial.name || '',
    amount: partial.amount || 0,
    type: partial.type || TransactionType.EXPENSE,
    category: partial.category || '',
    date: partial.date || new Date()
  };
}

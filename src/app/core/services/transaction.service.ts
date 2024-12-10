import { Injectable } from '@angular/core';
import { TransactionStore } from '../stores/transaction.store';
import { createTransaction, Transaction } from '../models/transaction.model';


@Injectable({ providedIn: 'root' })
export class TransactionService {
  constructor(private transactionStore: TransactionStore) {}

  addTransaction(transaction: Partial<Transaction>) {
    const newTransaction = createTransaction(transaction);
    this.transactionStore.add(newTransaction);
  }

  updateTransaction(id: string, updates: Partial<Transaction>) {
    this.transactionStore.update(id, updates);
  }

  removeTransaction(id: string) {
    this.transactionStore.remove(id);
  }

  clearAll() {
    this.transactionStore.reset();
  }
}

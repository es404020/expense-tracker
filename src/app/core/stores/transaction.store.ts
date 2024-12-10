import { Injectable } from '@angular/core';
import { EntityState, EntityStore, persistState, StoreConfig } from '@datorama/akita';
import { Transaction, TransactionType } from '../models/transaction.model';


export interface TransactionState extends EntityState<Transaction> {
  filter: {
    type?: TransactionType;
    category?: string;
  };
}

const initialState: TransactionState = {
  filter: {},
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'transactions', resettable: true })
export class TransactionStore extends EntityStore<TransactionState> {
  constructor() {
    super(initialState);

    // Configure local storage persistence
    persistState({
      include: ['transactions'],
      key: 'expense-tracker',
      storage: localStorage
    });
  }

  updateFilter(filter: Partial<TransactionState['filter']>) {
    this.update({ filter: { ...this.getValue().filter, ...filter } });
  }
}

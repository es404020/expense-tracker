import { TestBed } from '@angular/core/testing';
import { TransactionStore } from './transaction.store';

import { TransactionType } from '../models/transaction.model';
import { persistState } from '@datorama/akita';
import { EntityStore } from '@datorama/akita';
import { Store } from '@datorama/akita';

describe('TransactionStore', () => {
  let store: TransactionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionStore],
    });

    store = TestBed.inject(TransactionStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with default state', () => {
    const state = store.getValue();
    expect(state.filter).toEqual({});
  });

  it('should update filter state', () => {
    const filter = {
      type: TransactionType.EXPENSE,
      category: 'Food',
    };

    store.updateFilter(filter);

    const state = store.getValue();
    expect(state.filter.type).toBe(TransactionType.EXPENSE);
    expect(state.filter.category).toBe('Food');
  });

  it('should persist state in localStorage', () => {
    const filter = {
      type: TransactionType.INCOME,
      category: 'Rent',
    };

    // Update filter state
    store.updateFilter(filter);

    // Check if localStorage contains the persisted state
    const persistedState = JSON.parse(localStorage.getItem('expense-tracker')!);
    expect(persistedState.transactions.filter).toEqual(filter);
  });

  it('should retrieve persisted state from localStorage on initialization', () => {
    const filter = {
      type: TransactionType.EXPENSE,
      category: 'Groceries',
    };

    // Simulate that the state is already persisted
    localStorage.setItem(
      'expense-tracker',
      JSON.stringify({ transactions: { filter } })
    );

    // Reinitialize the store and check if the persisted filter is loaded
    store = TestBed.inject(TransactionStore);
    const state = store.getValue();
    expect(state.filter).toEqual(filter);
  });

  it('should reset the state when reset() is called', () => {
    const filter = {
      type: TransactionType.EXPENSE,
      category: 'Groceries',
    };

    store.updateFilter(filter); // Update filter
    store.reset(); // Reset the store

    const state = store.getValue();
    expect(state.filter).toEqual({});
  });
});

import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { TransactionStore, TransactionState } from './transaction.store';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction, TransactionType } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionQuery extends QueryEntity<TransactionState> {
  constructor(protected override store: TransactionStore) {
    super(store);
  }



  selectTotalBalance(): Observable<number> {
    return this.selectAll().pipe(
      map(transactions =>
        transactions.reduce((total, transaction) =>
          transaction.type === TransactionType.INCOME
            ? total + transaction.amount
            : total - transaction.amount,
          0
        )
      )
    );
  }

 
   selectFilteredTransactions(
    type?: TransactionType,
    category?: string,
    sortBy: 'date' | 'amount' = 'date',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Observable<Transaction[]> {
    return this.selectAll().pipe(
      map(transactions => {

        let filteredTransactions = type
          ? transactions.filter(t => t.type === type)
          : transactions;


        filteredTransactions = category
          ? filteredTransactions.filter(t => t.category === category)
          : filteredTransactions;


        return filteredTransactions.sort((a, b) => {
          const compareValue = sortBy === 'date'
            ? a.date.getTime() - b.date.getTime()
            : a.amount - b.amount;

          return sortDirection === 'asc'
            ? compareValue
            : -compareValue;
        });
      })
    );
  }

  // Get unique categories
  getCategories(): string[] {
    return [...new Set(this.getAll().map(t => t.category))];
  }

  // Get transactions by type
  getTransactionsByType(type: TransactionType): Transaction[] {
    return this.getAll().filter(t => t.type === type);
  }


}

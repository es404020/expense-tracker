import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  Transaction,
  TransactionType,
} from '../../core/models/transaction.model';
import { TransactionService } from '../../core/services/transaction.service';
import { TransactionQuery } from '../../core/stores/transaction.query';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from '../../shared/shared.module';
@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
})
export class TransactionListComponent implements OnInit {
  // Table configuration
  displayedColumns: string[] = [
    'select',
    'name',
    'amount',
    'category',
    'date',
    'actions',
  ];

  // Data source and selection
  dataSource!: MatTableDataSource<Transaction>;
  selection = new SelectionModel<Transaction>(true, []);

  // Filtering properties
  selectedType: string = '';
  selectedCategory: string = '';
  categories: string[] = [];
  currentSortOption: 'date' | 'amount' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private transactionQuery: TransactionQuery,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    // Initialize data source with an empty array of type Transaction
    this.dataSource = new MatTableDataSource<Transaction>([]);

    // Subscribe to transactions
    this.transactionQuery.selectAll().subscribe((transactions) => {
      this.dataSource.data = transactions;
      this.categories = [...new Set(transactions.map((t) => t.category))];

      // Configure paginator and sort after data load
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    window.addEventListener('resize', () => {
      this.updateDisplayedColumns(window.innerWidth);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  sortTransactions(transactions: Transaction[]): Transaction[] {
    return transactions.sort((a, b) => {
      const compareValue =
        this.currentSortOption === 'date'
          ? a.date.getTime() - b.date.getTime()
          : a.amount - b.amount;

      return this.sortDirection === 'asc' ? compareValue : -compareValue;
    });
  }

  applySorting() {
    const sortedTransactions = this.sortTransactions(this.dataSource.data);
    this.dataSource.data = sortedTransactions;
  }

  // Filter method
  applyFilter() {
    this.dataSource.filterPredicate = (data: Transaction) => {
      const typeMatch =
        !this.selectedType ||
        data.type === (this.selectedType as TransactionType);

      const categoryMatch =
        !this.selectedCategory || data.category === this.selectedCategory;

      return typeMatch && categoryMatch;
    };
    this.dataSource.filter = 'filter';
  }

  // Selection methods
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  deleteTransaction(id: string) {
    this.transactionService.removeTransaction(id);
  }

  updateDisplayedColumns(width: number) {
    if (width < 768) {
      this.displayedColumns = ['name', 'amount', 'date', 'actions']; // Minimal columns
    } else {
      this.displayedColumns = ['select', 'name', 'amount', 'category', 'date', 'actions'];
    }
  }
}

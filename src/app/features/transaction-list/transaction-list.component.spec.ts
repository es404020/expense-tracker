import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { TransactionListComponent } from './transaction-list.component';
import { TransactionService } from '../../core/services/transaction.service';
import { TransactionQuery } from '../../core/stores/transaction.query';
import { of } from 'rxjs';
import { Transaction, TransactionType } from '../../core/models/transaction.model';
import { SharedModule } from '../../shared/shared.module';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { By } from '@angular/platform-browser';

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let mockTransactionService: jasmine.SpyObj<TransactionService>;
  let mockTransactionQuery: jasmine.SpyObj<TransactionQuery>;

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      name: 'Transaction 1',
      amount: 100,
      category: 'Category 1',
      date: new Date('2023-01-01'),
      type: TransactionType.EXPENSE,
    },
    {
      id: '2',
      name: 'Transaction 2',
      amount: 200,
      category: 'Category 2',
      date: new Date('2023-02-01'),
      type: TransactionType.INCOME,
    },
  ];

  beforeEach(() => {
    mockTransactionService = jasmine.createSpyObj('TransactionService', ['removeTransaction']);
    mockTransactionQuery = jasmine.createSpyObj('TransactionQuery', ['selectAll']);
    mockTransactionQuery.selectAll.and.returnValue(of(mockTransactions));

    TestBed.configureTestingModule({
      imports: [
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        SharedModule,
      ],
      declarations: [TransactionListComponent],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: TransactionQuery, useValue: mockTransactionQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data source with transactions', () => {
    fixture.detectChanges(); // Trigger ngOnInit
    expect(component.dataSource.data).toEqual(mockTransactions);
    expect(component.categories).toEqual(['Category 1', 'Category 2']);
  });



  it('should apply sorting by amount', () => {
    fixture.detectChanges();
    component.currentSortOption = 'amount';
    component.sortDirection = 'desc';

    component.applySorting();

    const sortedTransactions = component.dataSource.data;
    expect(sortedTransactions[0].amount).toBeGreaterThanOrEqual(sortedTransactions[1].amount);
  });

  it('should filter transactions based on type', () => {
    fixture.detectChanges();
    component.selectedType = TransactionType.EXPENSE;
    component.applyFilter();

    expect(component.dataSource.filteredData).toEqual([mockTransactions[0]]);
  });

  it('should filter transactions based on category', () => {
    fixture.detectChanges();
    component.selectedCategory = 'Category 1';
    component.applyFilter();

    expect(component.dataSource.filteredData).toEqual([mockTransactions[0]]);
  });

  it('should select all rows when master toggle is clicked', () => {
    fixture.detectChanges();
    component.selection.select(mockTransactions[0]);

    component.masterToggle();

    expect(component.selection.selected.length).toBe(mockTransactions.length);
  });

  it('should clear selection when master toggle is clicked again', () => {
    fixture.detectChanges();
    component.selection.select(mockTransactions[0]);
    component.masterToggle(); // Select all

    component.masterToggle(); // Deselect all

    expect(component.selection.selected.length).toBe(0);
  });

  it('should delete a transaction when delete button is clicked', () => {
    fixture.detectChanges();

    const transactionId = mockTransactions[0].id;
    component.deleteTransaction(transactionId);

    expect(mockTransactionService.removeTransaction).toHaveBeenCalledWith(transactionId);
  });

  it('should return true when all rows are selected', () => {
    fixture.detectChanges();
    component.selection.select(...mockTransactions);
    expect(component.isAllSelected()).toBeTrue();
  });

  it('should return false when not all rows are selected', () => {
    fixture.detectChanges();
    expect(component.isAllSelected()).toBeFalse();
  });
});

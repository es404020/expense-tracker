import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionComponent } from './transaction.component';
import { MatDialog } from '@angular/material/dialog';
import { TransactionQuery } from '../../core/stores/transaction.query';
import { of } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { CreateTransactionComponent } from '../create-transaction/create-transaction.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;
  let mockTransactionQuery: jasmine.SpyObj<TransactionQuery>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockTransactionQuery = jasmine.createSpyObj('TransactionQuery', ['selectTotalBalance']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        CreateTransactionComponent,
        BrowserAnimationsModule, // Required for Material animations
      ],
      declarations: [TransactionComponent],
      providers: [
        { provide: TransactionQuery, useValue: mockTransactionQuery },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
    mockTransactionQuery.selectTotalBalance.and.returnValue(of(100)); // Mock the observable
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize totalBalance$ on ngOnInit', () => {
    component.ngOnInit();
    component.totalBalance$.subscribe((balance) => {
      expect(balance).toBe(100);
    });
  });

  it('should open the transaction dialog', () => {
    component.openTransactionDialog();
    expect(mockDialog.open).toHaveBeenCalledWith(CreateTransactionComponent, {
      width: '400px',
    });
  });
});

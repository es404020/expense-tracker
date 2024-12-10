import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTransactionComponent } from './create-transaction.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from '../../core/services/transaction.service';
import { TransactionType } from '../../core/models/transaction.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../shared/shared.module';
import { of } from 'rxjs';

describe('CreateTransactionComponent', () => {
  let component: CreateTransactionComponent;
  let fixture: ComponentFixture<CreateTransactionComponent>;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateTransactionComponent>>;

  beforeEach(async () => {
    transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['addTransaction']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, SharedModule],
      declarations: [CreateTransactionComponent],
      providers: [
        FormBuilder,
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on init', () => {
    expect(component.transactionForm).toBeDefined();
    expect(component.transactionForm.get('name')).toBeTruthy();
    expect(component.transactionForm.get('amount')).toBeTruthy();
    expect(component.transactionForm.get('type')).toBeTruthy();
    expect(component.transactionForm.get('category')).toBeTruthy();
    expect(component.transactionForm.get('date')).toBeTruthy();
  });

  it('should submit the form and call the transaction service', () => {
    component.transactionForm.setValue({
      name: 'Test Transaction',
      amount: 100,
      type: TransactionType.INCOME,
      category: 'Test Category',
      date: new Date(),
    });

    component.onSubmit();

    expect(transactionServiceSpy.addTransaction).toHaveBeenCalledWith({
      name: 'Test Transaction',
      amount: 100,
      type: TransactionType.INCOME,
      category: 'Test Category',
      date: jasmine.any(Date),
    });
    expect(dialogRefSpy.close).toHaveBeenCalled();
    expect(component.transactionForm.value.type).toEqual(TransactionType.EXPENSE);
  });

  it('should not call the transaction service if the form is invalid', () => {
    component.transactionForm.setValue({
      name: '',
      amount: -10, // Invalid
      type: TransactionType.INCOME,
      category: '',
      date: new Date(),
    });

    component.onSubmit();

    expect(transactionServiceSpy.addTransaction).not.toHaveBeenCalled();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});

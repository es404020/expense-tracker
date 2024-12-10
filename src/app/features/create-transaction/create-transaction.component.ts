import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TransactionQuery } from '../../core/stores/transaction.query';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionType } from '../../core/models/transaction.model';
import { TransactionService } from '../../core/services/transaction.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.scss',
  providers: [TransactionService, MatDatepickerModule],
})
export class CreateTransactionComponent implements OnInit {
  transactionForm: FormGroup = new FormGroup({});
  transactionTypes = Object.values(TransactionType);
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTransactionComponent>,
    private transactionService: TransactionService,

  ) {}



  ngOnInit() {
    this.initForm();


  }

  initForm() {
    this.transactionForm = this.fb.group({
      name: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      type: [TransactionType.EXPENSE, Validators.required],
      category: [''],
      date: [new Date()],
    });
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.transactionService.addTransaction(this.transactionForm.value);
      this.transactionForm.reset({
        type: TransactionType.EXPENSE,
        date: new Date(),
      });
      this.dialogRef.close();
    }
  }
}

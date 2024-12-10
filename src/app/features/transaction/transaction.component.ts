import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../core/services/transaction.service';

import { FormBuilder } from '@angular/forms';

import { Observable, of } from 'rxjs';
import {
  TransactionType,
  Transaction,
} from '../../core/models/transaction.model';
import { TransactionQuery } from '../../core/stores/transaction.query';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { SharedModule } from '../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { CreateTransactionComponent } from '../create-transaction/create-transaction.component';
@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [SharedModule, CreateTransactionComponent],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',

})
export class TransactionComponent implements OnInit {



  totalBalance$: Observable<number> = of(0);

  constructor(
    private fb: FormBuilder,

    private transactionQuery: TransactionQuery,
    private dialog: MatDialog
  ) {}

  ngOnInit() {


    this.totalBalance$ = this.transactionQuery.selectTotalBalance();
  }
  openTransactionDialog() {
    this.dialog.open(CreateTransactionComponent, {
      width: '400px', // You can adjust the modal size here
    });
  }



}

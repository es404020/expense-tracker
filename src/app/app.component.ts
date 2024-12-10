import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TransactionComponent } from './features/transaction/transaction.component';
import { TransactionListComponent } from './features/transaction-list/transaction-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,TransactionComponent,TransactionListComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'expense-tracker';
}

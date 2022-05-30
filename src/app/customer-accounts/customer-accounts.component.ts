import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Customer} from "../model/customer.model";
import {catchError, Observable, throwError} from "rxjs";
import {AccountDTO, AccountHistory} from "../model/account.model";
import {AccountService} from "../services/account.service";

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customer-accounts.component.html',
  styleUrls: ['./customer-accounts.component.css']
})
export class CustomerAccountsComponent implements OnInit {
  customerId!:number;
  custumer!:Customer;
  accounts!: Observable<Array<AccountDTO>>;
  errorMessage! :string;


  constructor(private accountService:AccountService,private route:ActivatedRoute,private router:Router) {
    this.custumer=this.router.getCurrentNavigation()?.extras.state as Customer;

  }

  ngOnInit(): void {
    console.log(this.accountService.getAccountByCustomerID(this.route.snapshot.params["id"]).
    subscribe(accounts=>{
      console.log(accounts);
    }));
  this.customerId=this.route.snapshot.params["id"];
    this.accounts=this.accountService.getAccountByCustomerID(this.customerId).pipe(
      catchError(err=>{
        this.errorMessage=err.message;
        return throwError(err);
      })
    );

  }

  handleAccountsOperations(account:AccountDTO){
    this.router.navigateByUrl('/accounts/'+account.id,{state:account});
  }


}

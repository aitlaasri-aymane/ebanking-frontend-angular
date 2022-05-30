import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccountService} from "../services/account.service";
import {catchError, Observable, throwError} from "rxjs";
import {Location} from "@angular/common";
import {AccountHistory} from "../model/account.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accountFormGroup!:FormGroup;
  operationFormGroup!:FormGroup;
  currentPage:number=0;
  pageSize:number=5;
  errorMessage! :string;
  accounts!: Observable<AccountHistory>;
  accountId: number=0;

  constructor(private _location: Location, private fb:FormBuilder,private accountService:AccountService,private route:ActivatedRoute,private router:Router) { }

  goBackToCustomer(){
    this._location.back()
  }

  ngOnInit(): void {
    this.accountId=this.route.snapshot.params["id"];
    console.log("accountId: "+this.accountId);

    this.accountFormGroup=this.fb.group({
      accountId:this.fb.control(this.accountId)
    });
    this.operationFormGroup=this.fb.group({
      operationType:this.fb.control(null),
      amount:this.fb.control(0),
      description:this.fb.control(null),
      operationDate:this.fb.control(null),
      accountDestination:this.fb.control(null)

    });
    if (this.accountId!=0)
    {
      this.handleSearchAccount();

    }

  }
  handleSearchAccount(){
    let accountID:string=this.accountFormGroup.value.accountId;
    this.accounts=this.accountService.getAccount(accountID,this.currentPage,this.pageSize).pipe(
      catchError(err=>{
        this.errorMessage=err.message;
        return throwError(err);
      })
    );

  }
  goToPage(page:number){
    this.currentPage=page;
    this.handleSearchAccount();
  }

  handleAccountOperation() {
    let accountId:string=this.accountFormGroup.value.accountId;
    let amount:number=this.operationFormGroup.value.amount;
    let description:string=this.operationFormGroup.value.description;
    let operationType:string=this.operationFormGroup.value.operationType;
    let operationDate:string=this.operationFormGroup.value.operationDate;
    let accountDestination:string=this.operationFormGroup.value.accountDestination;
    if(operationType=="DEBIT")
    {
        this.accountService.debit(accountId,amount,description).subscribe( {
          next:(data)=>{
            alert("debit success")
            this.operationFormGroup.reset();

            this.handleSearchAccount();

          },
          error:(err => {
            alert("debit not functioning properly")
          })
          }

        );
    }
    else  if (operationType=="CREDIT"){
      this.accountService.credit(accountId,amount,description).subscribe( {
          next:(data)=>{
            alert("credit success")
            this.operationFormGroup.reset();

            this.handleSearchAccount();

          },
          error:(err => {
            alert("credit not functioning properly")
          })
        }

      );
    }
    else if (operationType=="TRANSFER"){
      console.log(accountId+" "+accountDestination)
      this.accountService.transfer(accountId,accountDestination,amount).subscribe( {
          next:(data)=>{
            alert("transfer success")
            this.operationFormGroup.reset();

            this.handleSearchAccount();

          },
          error:(err => {
            alert("transfer not functioning properly")
          })
        }

      );
    }

  }
}

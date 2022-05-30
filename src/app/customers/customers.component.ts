import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CutomerService} from "../services/cutomer.service";
import {catchError, map, Observable, throwError} from "rxjs";
import {Customer} from "../model/customer.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers!: Observable<Array<Customer>>;
  errorMessage! :string;
  searchFormGroup: FormGroup | undefined;

  constructor(private customerService: CutomerService,private fb:FormBuilder,private router:Router) {
  }

  ngOnInit(): void {
    this.searchFormGroup=this.fb.group({
      keyword: this.fb.control("")
    });

    this.handleSearchCustomers();
    console.log(this.customerService.getCustomers().subscribe(customers=>{
      console.log(customers);
    }));
    }
  handleSearchCustomers(){
    let kw=this.searchFormGroup?.value.keyword;

    this.customers=this.customerService.searchCustomers(kw).pipe(
      catchError(err=>{
        this.errorMessage=err.message;
        return throwError(err);
      })
    );


  }

  handleDeleteCustomer(c:Customer){
    if(!confirm("Are u sure?"))return;
    this.customerService.deleteCustomer(c.id).subscribe({
      next:(resp)=>{
        this.customers=this.customers.pipe(
          map(data=>{
            let index=data.indexOf(c);
            data.slice(index,1);
            return data
          })
        );
      },
      error:err => {
        console.log(err)
      }
    });
  }

  handleCustomerAccounts(customer:Customer) {
    this.router.navigateByUrl("/customer-accounts/"+customer.id,{state:customer})

  }
}

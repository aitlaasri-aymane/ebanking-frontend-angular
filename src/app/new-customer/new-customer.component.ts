import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CutomerService} from "../services/cutomer.service";
import {Customer} from "../model/customer.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {

  newCustomerformGroup!: FormGroup;

  constructor(private customerService: CutomerService,private fb:FormBuilder
              ,private router:Router) {}

  ngOnInit(): void {
    this.newCustomerformGroup = this.fb.group({
      name: this.fb.control(null,[Validators.required,
        Validators.minLength(4)]),
      email: this.fb.control(null,[Validators.required,Validators.email])
    });
  }
  handleSaveCustomer(){
      let customer:Customer=this.newCustomerformGroup.value;
      this.customerService.saveCustomers(customer).subscribe({
        next:data=>{
         alert("Customer has been succefully saved");
        // this.newCustomerformGroup.reset();
          this.router.navigateByUrl("/customers");
        },
        error:err => {
          console.log(err)
        }
      });
  }

}

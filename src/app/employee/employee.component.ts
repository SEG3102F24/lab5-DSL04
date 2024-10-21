import {Component, inject} from '@angular/core';
import { AbstractControl, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import {EmployeeService} from "../service/employee.service";
import { Router, RouterLink } from "@angular/router";
import {Employee} from "../model/employee";
import { FirestoreService} from '../services/firestore.service';
import { Observable } from 'rxjs';
import { NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css'],
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule, NgIf, NgForOf, FormsModule]
})
export class EmployeeComponent {
  private builder: FormBuilder = inject(FormBuilder);
  private firestoreService: FirestoreService = inject(FirestoreService); // Use FirestoreService
  private employeeService: EmployeeService = inject(EmployeeService);
  private router: Router = inject(Router);
  employeeForm = this.builder.group({
    name: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    city: ['', Validators.required],
    salary: [0, Validators.required],
    gender: ['', Validators.pattern('^[MFX]$')],
    email: ['', Validators.email],
    position: ['', Validators.required],    // New field
    department: ['', Validators.required]    // New field
  });

  get name(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('name'); }
  get dateOfBirth(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('dateOfBirth'); }
  get city(): AbstractControl<string> {return <AbstractControl>this.employeeForm.get('city'); }
  get salary(): AbstractControl<number> {return <AbstractControl<number>>this.employeeForm.get('salary'); }
  get gender(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('gender'); }
  get email(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('email'); }

  // Submit the form and save data to Firestore
  onSubmit() {
    if (this.employeeForm.valid) {
      // Create an Employee object based on form values
      const employee: Employee = {
        name: this.name.value,
        dateOfBirth: new Date(this.dateOfBirth.value),
        city: this.city.value,
        salary: this.salary.value,
        gender: this.gender.value,
        email: this.email.value
      };

      // Save employee to Firestore
      this.firestoreService.addEmployee(employee)
        .then(() => {
          console.log('Employee saved to Firestore successfully!');
          this.employeeForm.reset(); // Reset the form after submission
          this.router.navigate(['/employees']); // Redirect to employee list (if route exists)
        })
        .catch((error) => {
          console.error('Error saving employee: ', error);
        });
    }
  }
}

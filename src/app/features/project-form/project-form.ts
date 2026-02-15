import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-project-form',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css',
})
export class ProjectForm {

  @Output() save = new EventEmitter<any>();

  form!: FormGroup;   // declare only

constructor(private fb: FormBuilder) {
  this.form = this.fb.group({
    project: [''],
    handle: [''],
    ca: [''],
    category: [''],
    chain: [''],
    useCase: [''],
    marketCap: [''],
    rating: [0],
    riskLevel: ['Low'],
    narrativeTag: ['']
  });
}

submit() {
  this.save.emit({
    id: crypto.randomUUID(),
    ...this.form.value,   // 👈 comma yaha zaroori hai
    createdAt: new Date() // 👈 real-time date
  });

  this.form.reset({
    marketCap: 0,
    rating: 0,
    riskLevel: 'Low'
  });
}
}
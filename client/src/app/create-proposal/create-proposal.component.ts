import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Place } from '../autocomplete-input/autocomplete-input.component';


@Component({
  selector: 'app-create-proposal',
  template: `
    <form (ngSubmit)="logForm()">
      <ion-item>
        <ion-label>Todo</ion-label>
        <ion-input type="text" [(ngModel)]="todo.title" name="title"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Todo</ion-label>
        <ion-input type="text" [(ngModel)]="todo.title" name="title"></ion-input>
      </ion-item>
      <app-autocomplete-input (onSearchResult)="onCitySelected($event)"></app-autocomplete-input>
      <app-autocomplete-input [(ngModel)]="zone" (onSearchResult)="onZoneSelected($event)" [region]="selectedCity" ></app-autocomplete-input>
      
      <ion-item>
        <ion-label>Description</ion-label>
        <ion-textarea [(ngModel)]="todo.description" name="description"></ion-textarea>
      </ion-item>
      <button ion-button type="submit" block>Add Todo</button>
    </form>
  `,
  styleUrls: ['./create-proposal.component.scss'],
})
export class CreateProposalComponent implements OnInit {
  private todo : FormGroup;
  selectedCity
  selection: string
  constructor( 
    private zone: NgZone,
    private formBuilder: FormBuilder ) {
    this.todo = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
    });
    setInterval(()=> this.selectedCity = this.getSelection(), 500)

  }


  getSelection(){ 
    return this.selection }
  
  onCitySelected(city: Place){
    this.zone.run(()=>{

      this.selectedCity = city.label
      this.selection = city.label
      console.log('selection updated  = ' + this.selection)
      console.log('selection updated  = ' + this.getSelection())
    })
  }
  onZoneSelected(zone:Place){
  }
  ngOnInit() {}

  logForm(){
    console.log(this.todo)
  }
}

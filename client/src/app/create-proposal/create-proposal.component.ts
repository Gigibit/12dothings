import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Place } from '../autocomplete-input/autocomplete-input.component';
import { ProposalService } from '../services/proposal.service';
import { PositionType } from '../core/models/proposal';


@Component({
  selector: 'app-create-proposal',
  template: `
    <form [formGroup]="proposalForm" novalidate>
      <ion-item>
        <ion-label>Name</ion-label>
        <ion-input type="text" formControlName="title"></ion-input>
      </ion-item>
      <app-autocomplete-input ngDefaultControl formControlName="city"   [placeholder]="'City'"(onSearchResult)="onCitySelected($event)" ></app-autocomplete-input>
      <app-autocomplete-input ngDefaultControl formControlName="district"  [placeholder]="'District'" (onSearchResult)="onZoneSelected($event)" [region]="selectedCity" ></app-autocomplete-input>
      <ion-item>
        <ion-label>Description</ion-label>
        <ion-textarea formControlName="description"></ion-textarea>
      </ion-item>
      <div padding>
        <ion-button [disabled]="proposalForm.invalid" (click)="create()" type="submit" size="large"  expand="block">Create</ion-button>
      </div>
    </form>
  `,
  styleUrls: ['./create-proposal.component.scss'],
})
export class CreateProposalComponent implements OnInit {
  private proposalForm : FormGroup
  selectedCity : string
  district: Place
  city: string
  constructor( 
    private proposalsService: ProposalService,
    private formBuilder: FormBuilder ) {
    this.proposalForm = this.formBuilder.group({
      title: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      description: [''],
    });
  }

  
  onCitySelected(city: Place){
    this.selectedCity  = city.label
    this.proposalForm.controls.city.setValue( city.label )
  }
  onZoneSelected(zone:Place){
    this.district = zone
    this.proposalForm.controls.district.setValue( zone.label )

  }
  ngOnInit() {}

  create(){
    alert('creating...')
    this.proposalsService.createProposal({
      title: this.proposalForm.controls['title'].value,
      description : this.proposalForm.controls['description'].value,
      position: {
        type : PositionType.POINT,
        coordinates : [Number.parseFloat(this.district.x), Number.parseFloat(this.district.y)]
      }
    }).subscribe(data=>{
      console.log(data)
    })
  }
}

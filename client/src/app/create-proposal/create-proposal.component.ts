import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Place } from '../autocomplete-input/autocomplete-input.component';
import { ProposalService } from '../services/proposal.service';
import { PositionType } from '../core/models/proposal';
import { ModalController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-create-proposal',
  template: `
    <ion-header>
      <ion-toolbar>
      <ion-button (click)="modalCtrl.dismiss(false)">
        <ion-icon name="close"></ion-icon>
      </ion-button>
      <ion-title>create new proposal, please!</ion-title>
    </ion-toolbar>
    </ion-header>
    <ion-content>
    <form [formGroup]="proposalForm" novalidate>
      <ion-item>
        <ion-label>Name</ion-label>
        <ion-input type="text" formControlName="title"></ion-input>
      </ion-item>
      City
      <app-autocomplete-input ngDefaultControl formControlName="city"   [placeholder]="'City'"(onSearchResult)="onCitySelected($event)" ></app-autocomplete-input>
      District
      <app-autocomplete-input ngDefaultControl formControlName="district"  [placeholder]="'District'" (onSearchResult)="onZoneSelected($event)" [region]="selectedCity" ></app-autocomplete-input>
      <ion-item>
        <ion-label>Description</ion-label>
        <ion-textarea formControlName="description"></ion-textarea>
      </ion-item>

    </form>
    <ion-item>
      <ion-label>Accept all requests</ion-label>
      <ion-checkbox slot="end" [(ngModel)]="requestsAutoaccept"></ion-checkbox>
    </ion-item>
    <!-- ion-item>
      <ion-label>Use your own photo!</ion-label>
      <ion-checkbox slot="end" [(ngModel)]="useOwnerPhoto"></ion-checkbox>
    </ion-item -->
    </ion-content>
    <ion-footer>
      <ion-button [disabled]="proposalForm.invalid" (click)="create()" size="large"  expand="block">create</ion-button>
    </ion-footer>
  `,
  styleUrls: ['./create-proposal.component.scss'],
})
export class CreateProposalComponent implements OnInit {
  private proposalForm : FormGroup
  selectedCity : string
  district: Place
  city: string
  requestsAutoaccept = true
  useOwnerPhoto = false

  constructor( 
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
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

  async create(){
    let loader = await this.load()
    loader.present()
    this.proposalsService.createProposal({
      title: this.proposalForm.controls['title'].value,
      description : this.proposalForm.controls['description'].value,
      // useOwnerPhoto: this.useOwnerPhoto,
      autoAcceptRequest : this.requestsAutoaccept,
      position: {
        type : PositionType.POINT,
        coordinates : [Number.parseFloat(this.district.x), Number.parseFloat(this.district.y)]
      }
    }).subscribe(data=>{
      loader.dismiss()
      if(data['status'] == 'OK'){
        this.modalCtrl.dismiss(true);
      }
    })
  }
  load() {
    return this.loadingCtrl.create({
      spinner: null,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
  }
}

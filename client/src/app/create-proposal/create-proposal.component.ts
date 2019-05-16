import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Place } from '../autocomplete-input/autocomplete-input.component';
import { ProposalService } from '../_services/proposal.service';
import { PositionType } from '../_models/proposal';
import { ModalController, LoadingController } from '@ionic/angular';
import { Globalization } from '@ionic-native/globalization/ngx';
import { languages, getLanguageByGlobalizationPrefix } from '../_datasources/languages';


@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.scss'],
})
export class CreateProposalComponent implements OnInit {
  private proposalForm : FormGroup
  selectedCity : string
  district: Place
  city: string
  requestsAutoaccept = true
  useOwnerPhoto = false
  languages = languages
  language: string
  constructor( 
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private proposalsService: ProposalService,
    private globalization: Globalization,
    private formBuilder: FormBuilder ) {
      this.proposalForm = this.formBuilder.group({
        title: ['', Validators.required],
        city: ['', Validators.required],
        district: ['', Validators.required],
        description: [''],

      });
      this.globalization.getPreferredLanguage()
      .then(res => {
        this.language = getLanguageByGlobalizationPrefix(res)
      })
      .catch(e => console.log(e));
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
        city : this.selectedCity,
        district : this.district.label,
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

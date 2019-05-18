import { Component, NgZone, Input, ElementRef, HostListener, HostBinding, Output, EventEmitter } from '@angular/core';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
const provider = new OpenStreetMapProvider();

export interface Place{
  bounds : [any],
  label : string,
  raw:{
    place_id: string,
    license: string,
    osm_type: string,
    osm_id: string,
    boundingbox : [any],
    type: string,
    lat : string,
    lon: string,
    importance: number,
    class: string
  },
  x: string,
  y: string
}


export enum AutocompleteType{
    CITY = 'city',
    NEIGHBORHOOD = 'living_street, village, neighbourhood, administrative, bus_stop, house, street, way'
}

@Component({
  selector: 'app-autocomplete-input',
  styleUrls: ['./autocomplete-input.component.scss'],
  templateUrl: './autocomplete-input.component.html'
})
export class AutocompleteInputComponent {
  @Input() public placeholder = "Search for a place..."
  @Input() public static = false


  _type: string
  @Input() public set type(type : string) {
    this._type = type;
  }
  public get type(){ return this._type; }
  
  private _region: string
  @Input() public set region(region : string) {
    this._region = region;
  }
  public get region(){ return this._region; }
  
  @Output() onSearchResult = new EventEmitter<Place>();
  places = []
  input = ''
  output = ''
  isSearchboxOpened = false

  constructor(private zone: NgZone, private eRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  clickout(event) { 
    this.isSearchboxOpened = this.eRef.nativeElement.contains(event.target); 
    if(!this.isSearchboxOpened){
      this.places=[]
      this.places.length = 0
    }
  }
  searchCall : any//NodeJS.Timeout
  updateSearchResults(){
    if(this.isSearchboxOpened){
      clearTimeout(this.searchCall)
      this.searchCall = setTimeout( ()=>{
        provider.search({ 
          query: this.input  + ' ' + ( this.region ? this.region.split(',')[0] : '' )  
        })
        .then( (results) => { 
          this.zone.run(()=> {
            this.places = this.uniq(results)//.filter( result => this.isRelevant(result)))
          })
        })
      }, 300);
    }
  }
  // isRelevant( result ){

  //   return true || this.type.indexOf(result.raw.type) !== -1 ||  this.type.indexOf(result.raw.osm_type) !== -1;
  // }
  regionsMatch(result: Place): any {
    if(this.region) return this.region.split(", ").every(elem => result.label.indexOf(elem) > -1);
    else return true;
  }

  uniq(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
        var item = a[i];
        var name = item.label.split(',')[0]
        if(seen[name] !== 1) {
              seen[name] = 1;
              out[j++] = item;
        }
    }
    return out;
  }
  onSerachResultTap(item){ 
    this.places=[]
    this.places.length = 0
    this.isSearchboxOpened = false
    this.onSearchResult.emit(item)

    if(!this.static){
      this.output = item.label
    }
    this.input = item.label
  }

}

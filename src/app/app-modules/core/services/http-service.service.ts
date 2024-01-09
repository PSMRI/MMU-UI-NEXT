import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, Subject } from "rxjs";


@Injectable()
export class HttpServiceService {
  language!: any;

  private _listners = new Subject<any>();

  listen(): Observable<any> {
     return this._listners.asObservable();
  }

  filter(filterBy: string) {
     this._listners.next(filterBy);
  }
  appCurrentLanguge = new BehaviorSubject(this.language);
  currentLangugae$ = this.appCurrentLanguge.asObservable();

  constructor( private _http: HttpClient,
    private http: HttpClient,) { }

  fetchLanguageSet() {
    console.log("Here i come");
    
      return this.http.get(environment.getLanguageList)
      //.map((res: any) => res.json().data);
                                                                                           
  }
  // languageAvailable(url: string): Observable<boolean> {
  //   return this._http.get(url).subscribe();
  // }
  getLanguage(url: string) {
    // if (this.languageAvailable(url) == true) {
    //   return this._http.get(url);
    // } else {
    //   console.log("error here");
    // }
    return this._http.get(url);
  }
  getCurrentLanguage(response: any) {
    console.log("here at one", response);
    this.language = response;
    console.log("teste",this.language);
    this.appCurrentLanguge.next(response) ;
    console.log("here at two",this.appCurrentLanguge.value);
  }
}

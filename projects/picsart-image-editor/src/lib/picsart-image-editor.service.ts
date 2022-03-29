import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PicsartImageEditorService {

  constructor(private httpClient: HttpClient) {
  }

  public picsartBackgroundChange(data: any, api: string, url: string): Observable<any> {
    const headers = { apikey: api};
    return this.httpClient.post(url, data, { headers });
  }
}

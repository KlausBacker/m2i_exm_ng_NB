import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Perso } from '../models/perso';

@Injectable({
  providedIn: 'root',
})
export class PersoService {
  persoStream = new BehaviorSubject<Perso[]>([]);

  dialogData: any;

  constructor(private http: HttpClient) {}

  getPerso(): Perso[] {
    return this.persoStream.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllPersos(): void {
    this.http.get<Perso[]>(environment.URL).subscribe((data) => {
      this.persoStream.next(data);
    });
  }

  deletePerso = (id: number): Observable<Perso[]> => {
    return this.http.delete<Perso[]>(`${environment.URL}/${id}`);
  };

  addPerso = (perso: Perso): Observable<Perso> => {
    return this.http.post<Perso>(environment.URL, perso);
  };

  changeState = (perso: Perso): Observable<Perso> => {
    return this.http.patch<Perso>(`${environment.URL}/${perso.id}`, perso);
  };
}

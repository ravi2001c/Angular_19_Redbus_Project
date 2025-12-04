import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Booking, IScheduleData, Search } from '../../model/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {

apiUrl:string = "https://api.freeprojectapi.com/api/BusBooking/";

  constructor(private http: HttpClient) {}

  searchBus(fromId: string, toId: string, date: string) {
    return this.http.get(this.apiUrl + "searchBus2?fromLocation="+fromId+"&toLocation="+toId+"&travelDate="+date+"")
  }

  getBusScheduleById(scheduleId:number) : Observable<IScheduleData>{
   return this.http.get<IScheduleData>(`${this.apiUrl}GetBusScheduleById?id=${scheduleId}`)
  }

  createNewBooking(obj:Booking){
   return this.http.post(`${this.apiUrl}PostBusBooking`,obj)
  }

  getBookedSeats(scheduleId:number){
   return this.http.get(`${this.apiUrl}getBookedSeats?scheduleId=${scheduleId}`)
  }
}

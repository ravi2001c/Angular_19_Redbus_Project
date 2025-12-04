import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../service/search.service';
import { Booking, BusBookingPassenger, IScheduleData } from '../../model/model';
import { CommonModule, DatePipe } from '@angular/common';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-book-ticket',
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './book-ticket.component.html',
  styleUrl: './book-ticket.component.scss',
})
export class BookTicketComponent {
  activatedRoute = inject(ActivatedRoute);
  searchService = inject(SearchService);
  scheduleData!: IScheduleData;
  seatNoList: number[] = [];
  selectedSeatArray: BusBookingPassenger[] = [];
  bookTicketObj: Booking = new Booking();
  bookedSeatList: number[] = [];
  seatsLoaded = false;

  qrImageUrl: string = '';
  showQR: boolean = false;
  qrCodeDataUrl: string = '';

  constructor() {
    this.activatedRoute.params.subscribe((res: any) => {
      debugger;
      const scheduleId = res.scheduleId;
      this.bookTicketObj.custId = 12548;
      this.bookTicketObj.scheduleId = scheduleId;
      this.bookTicketObj.bookingDate = new Date();
      this.getBusDetails(scheduleId);
      this.getBookedSeats(scheduleId);
    });
  }

  getBusDetails(scheduleId: number) {
    this.searchService
      .getBusScheduleById(scheduleId)
      .subscribe((res: IScheduleData) => {
        this.scheduleData = res;
        this.seatNoList = [];
        for (let index = 1; index <= this.scheduleData.totalSeats; index++) {
          this.seatNoList.push(index);
        }
      });
  }

  getBookedSeats(scheduleId: number) {
    this.searchService.getBookedSeats(scheduleId).subscribe((res: any) => {
      this.bookedSeatList = res;
      this.seatsLoaded = true;
    });
  }

  checkIfSeatIsSelected(seatNo: number) {
    const check = this.bookedSeatList.find((m) => m == seatNo);
    if (check != undefined) {
      return false;
    } else {
      return true;
    }
  }

  // checkIfBooked(seatNo: number) {
  //   const check = this.bookedSeatList.find((m) => m == seatNo);
  //   if(check != undefined){
  //     return false;
  //   }else{
  //     return true;
  //   }
  // }
  checkIfBooked(seatNo: number): boolean {
    return this.bookedSeatList.includes(seatNo);
  }

  // onSelect(seatNo: number) {
  //   const isExistIndex = this.selectedSeatArray.findIndex(
  //     (m) => m.seatNo == seatNo
  //   );
  //   if (isExistIndex! == undefined) {
  //     this.selectedSeatArray.splice(isExistIndex, 1);
  //   } else {
  //     const newPassengerData: BusBookingPassenger = {
  //       seatNo: seatNo,
  //       age: 0,
  //       bookingId: 0,
  //       gender: '',
  //       passengerId: 0,
  //       passengerName: '',
  //     };
  //     this.selectedSeatArray.push(newPassengerData);
  //   }
  // }

  onSelect(seatNo: number) {
    if (this.checkIfBooked(seatNo)) return; // booked seat cannot be selected

    const index = this.selectedSeatArray.findIndex((s) => s.seatNo === seatNo);
    if (index > -1) {
      this.selectedSeatArray.splice(index, 1); // unselect
    } else {
      this.selectedSeatArray.push({
        seatNo: seatNo,
        passengerName: '',
        age: 0,
        gender: '',
        bookingId: 0,
        passengerId: 0,
      });
    }
  }
  isSelected(seatNo: number): boolean {
    return this.selectedSeatArray.some((s) => s.seatNo === seatNo);
  }

  // proceedToPayment() {
  //   const totalAmount = this.selectedSeatArray.length * 1;
  //   const upiId = 'pc9752352@okicici';
  //   const name = 'RedBus Payment';
  //   const note = 'Bus Booking';

  //   const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
  //     name
  //   )}&tn=${encodeURIComponent(note)}&am=${totalAmount}&cu=INR`;

  //   QRCode.toDataURL(upiLink)
  //     .then((url) => {
  //       this.qrCodeDataUrl = url;
  //     })
  //     .catch((err) => console.error(err));
  // }

  // bookTicket() {
  //   debugger;
  //   this.bookTicketObj.busBookingPassengers = this.selectedSeatArray;
  //   this.searchService
  //     .createNewBooking(this.bookTicketObj)
  //     .subscribe((res: any) => {
  //       alert('Booking Successful! Your Booking ID is ' + res.bookingId);
  //     });
  // }

  bookTicket() {
  this.bookTicketObj.busBookingPassengers = this.selectedSeatArray;
  this.searchService
    .createNewBooking(this.bookTicketObj)
    .subscribe((res: any) => {
      alert('Booking Successful! Your Booking ID is ' + res.bookingId);

      // Step 2: newly booked seats ko booked list me add karo
      const newlyBookedSeats = this.selectedSeatArray.map(s => s.seatNo);
      this.bookedSeatList.push(...newlyBookedSeats);

      // Step 3: selection clear kar do
      this.selectedSeatArray = [];
    });
}
}

import { Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { BookTicketComponent } from './pages/book-ticket/book-ticket.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'search-result/:from/:to/:date',
    component: SearchResultComponent,
  },

  {
    path: 'book-Ticket/:scheduleId',
    component: BookTicketComponent,
  },
  {
    path:'my-Booking',
    component:MyBookingsComponent
  }
];

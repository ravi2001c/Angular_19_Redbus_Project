import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IsearchBus, Search } from '../../model/model';
import { SearchService } from '../service/search.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-search-result',
  imports: [CommonModule,DatePipe,RouterLink],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss',
})
export class SearchResultComponent {
  activatedRoute = inject(ActivatedRoute);
  searchObj: Search = new Search();
  searchService = inject(SearchService);
  searchData : IsearchBus[] = [];

  constructor() {
    this.activatedRoute.params.subscribe((res: any) => {
      debugger;
      this.searchObj.fromLocationId = res.from;
      this.searchObj.toLocationId = res.to;
      this.searchObj.date = res.date;
      this.getSearchResult();
    });
  }

  getSearchResult() {
    this.searchService.searchBus(this.searchObj.fromLocationId,this.searchObj.toLocationId,this.searchObj.date).subscribe((res:any)=>{
      console.log('Api Response',res)
    this.searchData = res;
    debugger;
    })
  }
}

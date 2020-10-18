import { Product } from './../../core/models/product';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-content',
  template: `
   <div *ngIf='paginationData.total_count > 0'>
    <app-content-header (toggleSize)="toggleSize($event)"
     [paginationInfo]="paginationData" [fillterList]="fillterList" [products]='productsList' (sortingUpdated)="sortingUpdatedContent($event)"></app-content-header>
    <app-product-list [(toggleLayout)]='toggleLayout'
     [products]='productsList' [paginationData]='paginationData' [taxonIds]="taxonIds"></app-product-list>
    </div>
  `,
  //   styleUrls: ['./content-header.component.scss'] <app-filter-summary></app-filter-summary>
  // <app-customize></app-customize>
})
export class ContentComponent implements OnInit {
  @Input() productsList;
  @Input() paginationData;
  @Input() taxonIds;
  @Input() fillterList;
  @Output() sortingUpdated = new EventEmitter<Object>();
  toggleLayout = { size: 'COZY' };

  constructor() { }

  ngOnInit() {
  }

  toggleSize(layoutInfo) {
    this.toggleLayout = layoutInfo;
  }

  sortingUpdatedContent(sortingIndex) {
    console.log("Updating the sort in Content component", sortingIndex.value);
    this.sortingUpdated.emit({ value: sortingIndex.value });
  }

}

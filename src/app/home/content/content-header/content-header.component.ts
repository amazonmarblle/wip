import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, PLATFORM_ID, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '../../../../../node_modules/@angular/common';
@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentHeaderComponent implements OnInit, OnChanges {
  @Output() toggleSize = new EventEmitter();
  @Output() sortingUpdated = new EventEmitter<Object>();
  @Input() paginationInfo;
  @Input() fillterList;
  @Input() products;
  subselectedItem;
  childselectedItem;
  screenWidth: any;
  filteredProducts;

  options = [
    { name: 'Price', value: 1 },
    { name: 'Avg.Customer Review', value: 2 },
    // { name: 'Most Reviews', value: 3 },
    { name: 'A To Z', value: 4 },
    { name: 'Z To A', value: 5 },
    { name: 'Newest', value: 6 }
  ];

  queryMap = {
    Newest: 'updated_at+asc',
    'Avg.Customer Review': 'avg_rating+desc',
    'Most Reviews': 'reviews_count+desc',
    'A To Z': 'name+asc',
    'Z To A': 'name+desc',
    Relevance: '',
  };

  selectedOption = 'Newest';
  isMobile: any;
  selectedSize = 'COZY';
  searchKeyword = '';
  selectedEntry;
  isfilterModalShown;
  issortModalShown;
  defaultselectedEntry = 'Newest';
  constructor(private routernomal: Router, @Inject(PLATFORM_ID) private platformId: any) { }

  ngOnChanges(changes: SimpleChanges): void {
    const equalIndex = location.href.indexOf('id=');
    const length = location.href.length;
    console.log('Filtering ' + this.products.length + ' products ' + ' using taxonId: ' + Number(location.href.substring(equalIndex+3,length)));
    const selectedIds = [Number(location.href.substring(equalIndex+3,length))];
    if (!this.products) {
      return;
    }
    if (!selectedIds || selectedIds.length === 0) {
      return this.products;
    }
    this.filteredProducts = this.products.filter(product => {
      let productPresent = false;
      selectedIds.forEach(id => {
        if (product.taxon_ids.findIndex(taxon_id => taxon_id === id) !== -1) {
          productPresent = true;
        }
      });
      return productPresent;
    });
  }

  sortModalShow() { this.issortModalShown = true; }
  sortModalhide() { this.issortModalShown = false; }

  filterModalShow() {
    this.isfilterModalShown = true;
  }
  filterModalhide() {
    this.isfilterModalShown = false;
  }

  onSelectionChange(entry) {
    this.selectedEntry = entry;
    this.sortFilter(this.selectedEntry.name);
    this.issortModalShown = false;
    this.selectedOption = entry;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.screen.width <= 768) {
        this.screenWidth = window.screen.width;
      }
    }
    const equalIndex = location.href.indexOf('id=');
    const length = location.href.length;
    console.log('Filtering ' + this.products.length + ' products ' + ' using taxonId: ' + Number(location.href.substring(equalIndex+3,length)));
    const selectedIds = [Number(location.href.substring(equalIndex+3,length))];
    if (!this.products) {
      return [];
    }
    if (!selectedIds || selectedIds.length === 0) {
      return this.products;
    }
    this.filteredProducts = this.products.filter(product => {
      let productPresent = false;
      selectedIds.forEach(id => {
        if (product.taxon_ids.findIndex(taxon_id => taxon_id === id) !== -1) {
          productPresent = true;
        }
      });
      return productPresent;
    });
  }

  toggleView(view) {
    this.selectedSize = view;
    this.toggleSize.emit({ size: view });
  }

  isSmallSelected(): boolean {
    return this.selectedSize === 'COZY';
  }

  isBigSelected(): boolean {
    return this.selectedSize === 'COMPACT';
  }
  fltermodelstate(flag) {
    this.isfilterModalShown = flag;
  }
  selectedInput(newVal) {
    this.subselectedItem = newVal;

  }
  childselectedInput(newVal) {
    this.childselectedItem = newVal;

  }

  sortFilter(i) {
    this.sortingUpdated.emit({ value: i });
  }
}

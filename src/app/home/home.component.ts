import { SearchActions } from './reducers/search.actions';
import {
  getSelectedTaxonIds,
  getProductsByKeyword,
  getChildTaxons,
  categeoryLevel,
  taxonomiByName,
  getPaginationData,
  searchFilterStatus
} from './reducers/selectors';
import { ProductActions } from './../product/actions/product-actions';
import { AppState } from './../interfaces';
import { getTaxonomies, rootTaxonomyId } from './../product/reducers/selectors';
import { Store } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, PLATFORM_ID, Inject } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Product } from '../core/models/product';
import { isPlatformBrowser } from '../../../node_modules/@angular/common';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  // products$: Observable<any>;
  taxonomies$: Observable<any>;
  brands$: Observable<any>;
  selectedTaxonIds$: Observable<number[]>;
  categoryLevel$: Observable<any>;
  products$: Observable<Product>;
  pagination$: Observable<any>;
  isFilterOn$: Observable<Boolean>;
  isBrandOpen = false;
  isCategoryOpen = true;
  screenwidth;
  isMobile;
  rootTaxonomyId: any;
  products: Product[];
  constructor(
    private store: Store<AppState>,
    private actions: ProductActions,
    private searchActions: SearchActions,
    @Inject(PLATFORM_ID) private platformId: any) {
    this.store.dispatch(this.actions.getAllProducts(1));
    this.store.dispatch(this.actions.getAllTaxonomies());
    this.taxonomies$ = this.store.select(getTaxonomies);
    this.brands$ = this.store.select(getTaxonomies);
    this.selectedTaxonIds$ = this.store.select(getSelectedTaxonIds);
    this.products$ = this.store.select(getProductsByKeyword);

    this.store.select(getProductsByKeyword).subscribe(s => this.products = s);

    this.pagination$ = this.store.select(getPaginationData);
    this.isFilterOn$ = this.store.select(searchFilterStatus);
    this.store.select(rootTaxonomyId)
      .subscribe(id => this.rootTaxonomyId = id);
  }

  // tslint:disable-next-line:member-ordering
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  // tslint:disable-next-line:member-ordering
  isModalShown = false;

  showModal(): void {
    this.isModalShown = true;
  }
  calculateInnerWidth() {
    if (this.screenwidth <= 1000) {
      this.isMobile = this.screenwidth;
    }
  }
  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.screenwidth = window.innerWidth;
    }
    this.calculateInnerWidth();
  }

  OnCategeorySelected(category) {
    this.store.dispatch(this.searchActions.getChildTaxons(this.rootTaxonomyId, category.id));
    this.taxonomies$ = this.store.select(getChildTaxons);
    this.categoryLevel$ = this.store.select(categeoryLevel);
    // ToDo: Here Brands are hardcoded For now.
    this.store.dispatch(this.searchActions.getTaxonomiesByName('Brands', category.name));
    this.brands$ = this.store.select(taxonomiByName);
    this.store.dispatch(this.searchActions.setSearchFilterOn());
  }
  showAll() {
    this.store.dispatch(this.searchActions.setSearchFilterOff());
  }

  isOpenChangeaccourdian() {
    this.isCategoryOpen = !this.isCategoryOpen;
  }

  sortingUpdated(selectedIndex) {
    if (selectedIndex.value == "Z To A") {
      this.products = [...this.products.sort((p1, p2) => p1.name < p2.name ? 1 : -1)];
    } else if (selectedIndex.value == "A To Z") {
      this.products = [...this.products.sort((p1, p2) => p1.name > p2.name ? 1 : -1)];
    } else if (selectedIndex.value == "Avg.Customer Review") {
      this.products = [...this.products.sort((p1, p2) => p1.avg_rating < p2.avg_rating ? 1 : -1)];
    } else if (selectedIndex.value == "Price") {
      this.products = [...this.products.sort((p1, p2) => p1.price < p2.price ? 1 : -1)];
    } else {
      this.products = [...this.products.sort((p1, p2) => p1.name > p2.name ? 1 : -1)];
    }
  }
}

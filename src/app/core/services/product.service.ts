import { JsonApiParserService } from './json-api-parser.service';
import { CJsonApi } from './../models/jsonapi';
import { ToastrService } from 'ngx-toastr';
import { Taxonomy } from './../models/taxonomy';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { forkJoin } from "rxjs/observable/forkJoin";
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class ProductService {
  /**
   * Creates an instance of ProductService.
   * @param {HttpService} http
   *
   * @memberof ProductService
   */
  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private apiParser: JsonApiParserService,
    private firestore: AngularFirestore
  ) { }
  // tslint:disable-next-line:member-ordering
  success: any;
  // tslint:disable-next-line:member-ordering
  error: any;
  /**
   *
   *
   * @param {string} id
   * @returns {Observable<Product>}
   *
   * @memberof ProductService
   */
  getProduct(id: string): Observable<Product> {
    return this.firestore.collection('allProducts', ref => ref.where('subversion', '==', id)).get()
      .pipe(
        map(
          querySnapshot => {
            let products: Array<Product> = [];
            querySnapshot.forEach(function (doc) {
              products.push(doc.data() as Product);
            });
            let myProduct: Product = this.apiParser.parseSingleObj(products[0]) as Product;
            return myProduct;
          }
        )
      );
  }

  getProductReviews(products): Observable<any> {
    return this.http.get(`products/${products}/reviews`);
  }
  /**
   *
   *
   * @returns {Array<Taxonomy>}
   *
   * @memberof ProductService
   */
  getTaxonomies(): any {
    return this.firestore.collection('taxonomies').get()
      .pipe(
        map(
          querySnapshot => {
            let taxonomies: Array<Taxonomy> = [];
            querySnapshot.forEach(function (doc) {
              taxonomies.push(doc.data() as Taxonomy);
            });
            return taxonomies;
          }
        )
      );
  }

  /**
   *
   *
   * @returns {Array<Product>}
   *
   * @memberof ProductService
   */
  getProducts(pageNumber: number): Observable<Array<Product>> {
    return this.firestore.collection('productsLandingPage').get()
      .pipe(
        map(
          querySnapshot => {
            let products: Array<Product> = [];
            querySnapshot.forEach(function (doc) {
              products.push(doc.data() as Product);
            });
            return this.apiParser.parseArrayofObject(products) as Array<Product>;
          }
        )
      );
  }

  markAsFavorite(id: number): Observable<{}> {
    return this.http.post<{}>(`favorite_products`, { id: id });
  }

  removeFromFavorite(id: number): Observable<{}> {
    return this.http.delete<{}>(`favorite_products/${id}`);
  }

  getFavoriteProducts(): Observable<Array<Product>> {
    return this.firestore.collection('favouriteProducts').get()
      .pipe(
        map(
          querySnapshot => {
            let products: Array<Product> = [];
            querySnapshot.forEach(function (doc) {
              products.push(doc.data() as Product);
            });
            return this.apiParser.parseArrayofObject(products) as Array<Product>;
          }
        )
      );
  }

  getUserFavoriteProducts(): Observable<Array<Product>> {
    return this.http
      .get<{ data: CJsonApi[] }>(
        `spree/user_favorite_products.json?data_set=small`
      )
      .pipe(
        map(
          resp => this.apiParser.parseArrayofObject(resp.data) as Array<Product>
        )
      );
  }

  // tslint:disable-next-line:max-line-length
  getProductsByTaxon(id: string): Observable<any> {
    return this.http
      .get<{ data: CJsonApi[]; pagination: Object }>(
        `api/v1/taxons/products?${id}&per_page=20&data_set=small`
      )
      .pipe(
        map(resp => {
          return {
            pagination: resp.pagination,
            products: this.apiParser.parseArrayofObject(resp.data) as Array<Product>
          };
        })
      );
  }

  getProductsByTaxonNP(id: string): Observable<Array<Product>> {
    let products = this.firestore.collection('products').get();
    let consiceProducts = this.firestore.collection('productsLandingPage').get();

    return forkJoin([products, consiceProducts]).pipe(map(
      results => {
        let productIds = new Array<number>();
        results[0].forEach(function (doc) {
          let taxon_ids = doc.data().taxon_ids;
          if (taxon_ids.indexOf(id) != -1) {
            productIds.push(doc.data().id);
          }
        });

        let products: Array<Product> = [];
        results[1].forEach(function (doc) {
          if (productIds.indexOf(doc.data().id) != -1)
            products.push(doc.data() as Product);
        });
        console.error("Optimize this call to use the cached consiceProduct data instead of new db call");
        return this.apiParser.parseArrayofObject(products) as Array<Product>;
      }
    ));
  }

  getTaxonByName(name: string): Observable<Array<Taxonomy>> {
    return this.firestore.collection('taxonomies', ref => ref.where('name', '==', name)).get().pipe(
      map(
        querySnapshot => {
          let taxonomies: Array<Taxonomy> = [];
          querySnapshot.forEach(function (doc) {
            taxonomies.push(doc.data() as Taxonomy);
          });
          return taxonomies;
        }
      )
    );
  }

  getproductsByKeyword(keyword: string): Observable<any> {
    return this.http
      .get<{ data: CJsonApi[]; pagination: Object }>(
        `api/v1/products?${keyword}&per_page=20&data_set=small&${+new Date().getDate()}`
      )
      .pipe(
        map(resp => {
          return {
            pagination: resp.pagination,
            products: this.apiParser.parseArrayofObject(resp.data) as Array<
              Product
            >
          };
        })
      );
  }

  getChildTaxons(
    taxonomyId: string,
    taxonId: string
  ): Observable<Array<Taxonomy>> {
    return this.http.get<Array<Taxonomy>>(
      `/api/v1/taxonomies/${taxonomyId}/taxons/${taxonId}`
    );
  }

  submitReview(productId: any, params: any) {
    return this.http.post(`products/${productId}/reviews`, params).pipe(
      map(
        success => {
          this.success = success;
          if (this.success.type === 'info') {
            this.toastrService.info(this.success.message, this.success.type);
            return this.success.type;
          } else {
            this.toastrService.success(this.success.message, this.success.type);
            return this.success.type;
          }
        },
        error => {
          this.error = error;
          this.toastrService.error(this.error.message, this.error.type);
          return this.error.type;
        }
      )
    );
  }

  getRelatedProducts(productId: any): Observable<Array<Product>> {
    return this.http
      .get<{ data: CJsonApi[] }>(`api/products/${productId}/relations`)
      .pipe(
        map(
          resp => this.apiParser.parseArrayofObject(resp.data) as Array<Product>
        )
      );
  }
}

import { map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getOrderNumber } from './../../checkout/reducers/selectors';
import { CheckoutActions } from './../../checkout/actions/checkout.actions';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { LineItem } from './../models/line_item';
import { AppState } from './../../interfaces';
import { Store } from '@ngrx/store';
import { Order } from '../models/order';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { from } from 'rxjs';

@Injectable()
export class CheckoutService {
  private orderNumber: number;

  /**
   * Creates an instance of CheckoutService.
   * @param {HttpService} http
   * @param {CheckoutActions} actions
   * @param {Store<AppState>} store
   *
   * @memberof CheckoutService
   */
  constructor(
    private http: HttpClient,
    private actions: CheckoutActions,
    private store: Store<AppState>,
    private toastyService: ToastrService,
    private firestore: AngularFirestore,
    @Inject(PLATFORM_ID) private platformId: any) {
    this.store.select(getOrderNumber)
      .subscribe(number => (this.orderNumber = number));
  }

  /**
   *
   *
   * @param {number} variant_id
   * @returns
   *
   * @memberof CheckoutService
   */
  createNewLineItem(variant_id: number, quantity: number, mobile: number) {
      let orderData: Order = this.getOrderFromSession();
      const existingLineItem: LineItem[] = orderData['line_items'];
      existingLineItem.push({ variant_id: variant_id, quantity: quantity, id: existingLineItem.length + 1 } as LineItem);
      orderData['line_items'] = existingLineItem;
      if(mobile != null) this.firestore.collection('ordersEnquiry').doc(`${this.orderNumber}_${mobile}_${new Date()}`).set(orderData);
      return this.firestore.collection('orders').doc(`${this.orderNumber}`).set(orderData)
              .then(() => {
                mobile == null ? this.toastyService.success('Success!', 'Cart updated!') :  this.toastyService.success('Success!', 'Enquiry Sent!');
                return { variant_id: variant_id, quantity: quantity } as LineItem;
              })
              .catch(() => this.toastyService.error('Something went wrong!', 'Failed'));
  }

  /**
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  fetchCurrentOrder() {

    return this.firestore.collection('orders').doc('xyz').get().pipe(
      map(order => {
        if (order.exists) {
          const orderData: Order = order.data() as Order;
          const token = orderData.token;
          this.setOrderTokenInLocalStorage({ order_token: token });
          return this.store.dispatch(
            this.actions.fetchCurrentOrderSuccess(orderData)
          );
        } else {
          this.createEmptyOrder().subscribe();
        }
      })
    );
  }

  /**
   *
   *
   * @param {string} orderNumber
   * @returns
   * @memberof CheckoutService
   */
  getOrder(orderNumber: string) {
    const url = `api/v1/orders/${orderNumber}.json`;
    return this.http.get<Order>(url);
  }

  /**
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  createEmptyOrder() {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain');

    let newOrder: Order = {
      "id": 0,
      "number": "0",
      "item_total": "0.0",
      "total": "0.0",
      "ship_total": "0.0",
      "state": "cart",
      "adjustments": [],
      "credit_cards": [],
      "line_items": [],
      "adjustment_total": "0.0",
      "user_id": null,
      "created_at": `${firebase.firestore.Timestamp.fromDate(new Date()).toDate()}`,
      "updated_at":  `${firebase.firestore.Timestamp.fromDate(new Date()).toMillis()}`,
      "completed_at": null,
      "payment_total": "0.0",
      "shipment_state": null,
      "payment_state": null,
      "email": null,
      "special_instructions": null,
      "channel": "spree",
      "included_tax_total": "0.0",
      "additional_tax_total": "0.0",
      "display_included_tax_total": "$0.00",
      "display_additional_tax_total": "$0.00",
      "tax_total": "0.0",
      "currency": "USD",
      "considered_risky": false,
      "canceler_id": null,
      "display_item_total": "$0.00",
      "total_quantity": 0,
      "display_total": "$0.00",
      "display_ship_total": "$0.00",
      "display_tax_total": "$0.00",
      "display_adjustment_total": "$0.00",
      "token": "51n5hV52XRzYLmzY0zEDCQ1555867412562",
      "checkout_steps": [
        "address",
        "delivery",
        "complete"
      ],
      "bill_address": null,
      "ship_address": null,
      "payments": [],
      "permissions": {can_update: true},
      "shipments": []
    }

    // Create a reference to the SF doc.
    let ordersCollection = this.firestore.firestore.collection('orders');
    var orderCountDocumentRef = ordersCollection.doc('0');
    
    return from(this.firestore.firestore.runTransaction(transaction =>
      // This code may get re-run multiple times if there are conflicts.
      transaction.get(orderCountDocumentRef)
        .then(orderCountDocumet => {
          const newOrderNumber = orderCountDocumet.data().orderNumber + 1;
          transaction.update(orderCountDocumentRef, { orderNumber: newOrderNumber });
          let newOrderRef = ordersCollection.doc(`${newOrderNumber}`);
          newOrder.id = newOrderNumber;
          newOrder.number = newOrderNumber.toString();
          newOrder.token = newOrderNumber.toString();
          this.setOrderTokenInLocalStorage({ order_token: newOrder.token });
          this.setOrderInLocalStorage({ order: newOrder });
          transaction.set(newOrderRef, newOrder);
        })).then(() => {
          console.log("Transaction successfully committed!");
          return this.store.dispatch(
            this.actions.fetchCurrentOrderSuccess(newOrder)
          );
        })
      .catch(error => this.toastyService.error('Unable to create empty order', 'ERROR!!')));

    // return this.http
    //   .post<Order>('api/v1/orders.json', null, { headers: headers })
    //   .pipe(
    //     map(order => {
    //       this.setOrderTokenInLocalStorage({ order_token: order.token });
    //       return this.store.dispatch(
    //         this.actions.fetchCurrentOrderSuccess(order)
    //       );
    //     }),
    //     tap(
    //       _ => _,
    //       _ =>
    //         this.toastyService.error('Unable to create empty order', 'ERROR!!')
    //     )
    //   );
  }

  /**
   *
   *
   * @param {LineItem} lineItem
   * @returns
   *
   * @memberof CheckoutService
   */
  deleteLineItem(lineItem: LineItem) {
    const url = `api/v1/orders/${this.orderNumber}/line_items/${
      lineItem.id
      }?order_token=${this.getOrderToken()}`;
    return this.http
      .delete(url)
      .pipe(
        map(() =>
          this.store.dispatch(this.actions.removeLineItemSuccess(lineItem))
        )
      );
  }

  /**
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  changeOrderState() {
    const url = `api/v1/checkouts/${
      this.orderNumber
      }/next.json?order_token=${this.getOrderToken()}`;
    return this.http
      .put<Order>(url, {})
      .pipe(
        map(order =>
          this.store.dispatch(this.actions.changeOrderStateSuccess(order))
        )
      );
  }

  /**
   *
   *
   * @param {any} params
   * @returns
   *
   * @memberof CheckoutService
   */
  updateOrder(params: any) {
    const url = `api/v1/checkouts/${
      this.orderNumber
      }.json?order_token=${this.getOrderToken()}`;
    return this.http
      .put<Order>(url, params)
      .pipe(
        map(order =>
          this.store.dispatch(this.actions.updateOrderSuccess(order))
        )
      );
  }

  /**
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  availablePaymentMethods() {
    const url = `api/v1/orders/${
      this.orderNumber
      }/payments/new?order_token=${this.getOrderToken()}`;
    return this.http.get<any>(url);
  }

  /**
   *
   *
   * @param {number} paymentModeId
   * @param {number} paymentAmount
   * @returns
   * @memberof CheckoutService
   */
  createNewPayment(paymentModeId: number, paymentAmount: number) {
    return this.http
      .post(
        `api/v1/orders/${
        this.orderNumber
        }/payments?order_token=${this.getOrderToken()}`,
        {
          payment: {
            payment_method_id: paymentModeId,
            amount: paymentAmount
          }
        }
      )
      .pipe(map(_ => this.changeOrderState().subscribe()));
  }

  makePayment(paymentAmount: number, address: any, orderNumber: string) {
    const payUbizSalt = environment.config.payuBizSalt;
    const payUbizKey = environment.config.payuBizKey;
    const successUrl = `${environment.apiEndpoint}payubiz/handle_payment`;
    const failureUrl = `${environment.apiEndpoint}payubiz/canceled_payment`;

    const hashParams = {
      key: payUbizKey,
      txnid: `${orderNumber}` + `${(Math.random().toString(36).substr(2, 9)).toUpperCase()}`,
      amount: paymentAmount,
      productinfo: `${environment.appName}-Product`,
      firstname: address.firstname,
      email: isPlatformBrowser(this.platformId) ? JSON.parse(localStorage.getItem('user')).email : '',
      udf1: `${orderNumber}`
    };
    // tslint:disable-next-line:max-line-length
    const paramsList = `${hashParams.key}|${hashParams.txnid}|${hashParams.amount}|${hashParams.productinfo}|${hashParams.firstname}|${hashParams.email}|${hashParams.udf1}||||||||||${payUbizSalt}`;
    const encryptedHash = CryptoJS.SHA512(paramsList);
    const hashString = CryptoJS.enc.Hex.stringify(encryptedHash);

    const params = {
      key: hashParams.key,
      txnid: hashParams.txnid,
      amount: hashParams.amount,
      productinfo: hashParams.productinfo,
      firstname: hashParams.firstname,
      email: hashParams.email,
      phone: address.phone,
      udf1: hashParams.udf1,
      surl: successUrl,
      furl: failureUrl,
      hash: hashString,
    };

    return this.http.post(`payubiz/post_request_payubiz`, { params: params })
      .pipe(
        map(res => { return res; }), error => { return error; }
      );
  }
  /**
   *
   *
   * @private
   * @returns
   *
   * @memberof CheckoutService
   */
  private getOrderToken() {
    const order = isPlatformBrowser(this.platformId) ? JSON.parse(localStorage.getItem('order')) : {};
    const token = order.order_token;
    return token;
  }

  private getOrderFromSession() {
    const order = isPlatformBrowser(this.platformId) ? JSON.parse(localStorage.getItem('orderFull')) : {};
    return order.order;
  }

  shipmentAvailability(pincode: number) {
    return this.http
      .post(`address/shipment_availability`, { pincode: pincode });
  }
  /**
   *
   *
   * @private
   * @param {any} token
   *
   * @memberof CheckoutService
   */
  private setOrderTokenInLocalStorage(token: any): void {
    const jsonData = JSON.stringify(token);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('order', jsonData);
    }
  } 

  private setOrderInLocalStorage(order: any): void {
    const jsonData = JSON.stringify(order);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('orderFull', jsonData);
    }
  }
}

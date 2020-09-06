import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '../../../../../core/models/product';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { AppState } from '../../../../../interfaces';
import { Store } from '@ngrx/store';
import { getTotalCartItems } from '../../../../../checkout/reducers/selectors';
import { WindowService } from '../../../../../core/services/window.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-product-count',
  templateUrl: './product-count.component.html',
  styleUrls: ['./product-count.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ProductCountComponent implements OnInit {
  @Input() product: Product;
  @Input() isOrderable;
  @Output() onAddToCart = new EventEmitter<Object>();
  @Output() onMarkAsFavorites = new EventEmitter<Object>();

  totalCartItems$: Observable<number>;
  cartCount: number;
  mobileNumber: number;
  isValidMobileNumber: boolean = false;
  mobileNumberOtp: number;
  isMobileNumberEntered: boolean = false;
  isMobileNumberValidated: boolean = false;
  windowRef: any;

  count: any = 100;
  appConfig = environment.config;
  constructor(private router: Router,
    private store: Store<AppState>,
    private win: WindowService) {
    this.totalCartItems$ = this.store.select(getTotalCartItems);
  }

  ngOnInit() {
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible'
    });

    this.windowRef.recaptchaVerifier.render()
  }

  increseCount() {
    this.count += 100;
  }

  /**
   *
   *
   * @memberof ProductcountComponent
   */
  decreaseCount() {
    this.count -= 100;
    if (this.count <= 1) {
      this.count = 100;
    }

  }

  addToCart(count: number) {
    this.onAddToCart.emit({ count: count, buyNow: false });
  }

  buyNow(count: number) {
    console.log(this.mobileNumber);
    this.onAddToCart.emit({ count: count, buyNow: true, mobileNumber: this.mobileNumber });
  }

  markAsFavorites() {
    this.onMarkAsFavorites.emit();
  }

  onMobileNumberChange(mobile) {
    if (/^\d{10}$/.test(mobile)) {
      this.isValidMobileNumber = true;
    } else {
      this.isValidMobileNumber = false;
      this.isMobileNumberEntered = false;
    }
  }

  getOtp() {
    this.isMobileNumberEntered = true;
    const appVerifier = this.windowRef.recaptchaVerifier;

    const num = '+91' + this.mobileNumber.toString();

    firebase.auth().signInWithPhoneNumber(num, appVerifier)
            .then(result => {

                this.windowRef.confirmationResult = result;
                this.windowRef.confirmationResult ? console.log('Message Sent') : console.log('Message Not Sent');

            })
            .catch( error => console.log(error) );
  }

  submitOtp() {
    console.log(this.mobileNumber);
    console.log(this.mobileNumberOtp);
    this.isMobileNumberValidated = true;
    this.windowRef.confirmationResult
                  .confirm(this.mobileNumberOtp.toString())
                  .then( result => {

                    console.log(result.user);

    })
    .catch( error => console.log(error, "Incorrect code entered?"));
  }
  
}

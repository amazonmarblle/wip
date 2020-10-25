import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Product } from '../../../../../core/models/product';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { AppState } from '../../../../../interfaces';
import { Store } from '@ngrx/store';
import { getTotalCartItems } from '../../../../../checkout/reducers/selectors';
import { WindowService } from '../../../../../core/services/window.service';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as introJs from '../../../../../../../node_modules/intro.js/intro.js';

@Component({
  selector: 'app-product-count',
  templateUrl: './product-count.component.html',
  styleUrls: ['./product-count.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductCountComponent implements OnInit, OnDestroy {
  @Input() product: Product;
  @Input() isOrderable;
  @Output() onAddToCart = new EventEmitter<Object>();
  @Output() onMarkAsFavorites = new EventEmitter<Object>();
  introTimer;

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
  introJS2 = introJs();
  constructor(private router: Router,
    private store: Store<AppState>,
    private win: WindowService,
    private ref: ChangeDetectorRef,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
    @Inject(PLATFORM_ID) private platformId: any) {
    this.totalCartItems$ = this.store.select(getTotalCartItems);
    this.introJS2.setOptions({
      steps: [
        {
          element: '#step5',
          intro: 'Enter Mobile Number',
          position: 'bottom'
        },
        {
          element: '#step6',
          intro: "Get OTP & Submit the received OTP",
          position: 'bottom'
        },
        {
          element: '#step8',
          intro: 'Submit Enquiry, we will reach out to you (Click Done).',
          position: 'bottom'
        }
      ],
      showProgress: true
    });
    this.introJS2.oncomplete(this.handleOnComplete);
    this.introJS2.onexit(() => this.handleOnExit(introJs));
  }

  ngOnInit() {
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container',
    {
      size: "invisible",
      callback: (response) => {
        console.log("in the callback", response);
        this.getOtp;
      }
    });
    this.windowRef.recaptchaVerifier.render()
    const mobileNumberFromStorage = this.getMobileNumberInLocalStorage();
    if (mobileNumberFromStorage) {
      this.mobileNumber = mobileNumberFromStorage;
      this.isMobileNumberValidated = true;
    } else {
      if (this.getIsIntro2Visited() !== true) {
        this.introTimer = setTimeout(() => this.introJS2.start(), 5000);
      }
    }
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
      this.ref.detectChanges();
    } else {
      this.isValidMobileNumber = false;
      this.isMobileNumberEntered = false;
      this.ref.detectChanges();
    }
  }

  getOtp() {
    this.ngxService.start();
    this.isMobileNumberEntered = true;
    const appVerifier = this.windowRef.recaptchaVerifier;

    const num = '+91' + this.mobileNumber.toString();

    firebase.auth().signInWithPhoneNumber(num, appVerifier)
            .then(result => {
              this.ngxService.stop();
                this.windowRef.confirmationResult = result;
                if (this.windowRef.confirmationResult) {
                  this.isMobileNumberEntered = true;
                  
                  this.toastrService.success('Success', 'You will receive OTP shortly.');
                  
                  // this.toastrService.success('Success!', 'Cart updated!')
                  console.log('SUCCESS', 'Message Sent');
                } else {
                  this.isMobileNumberEntered = false;
                  this.toastrService.error('Error', 'Error while receiving OTP, try another mobile.');
                  // this.toastrService.success('Success!', 'Cart updated!')
                  console.log('ERROR', 'Message Not Sent 1');
                }
                this.ref.detectChanges();
            })
            .catch( error => {
              this.ngxService.stop();
              this.toastrService.error('Error', 'Error while receiving OTP, try another mobile.');
              // this.toastrService.success('Success!', 'Cart updated!')
              this.isMobileNumberEntered = false;
              this.isMobileNumberValidated = false;
              this.isValidMobileNumber = false;
              console.log('ERROR', error.message);
              this.setMobileNumberInLocalStorage(false);
              this.ref.detectChanges();
            });
  }

  submitOtp() {
    this.ngxService.start();
    this.windowRef.confirmationResult
                  .confirm(this.mobileNumberOtp.toString())
                  .then( result => {
                    this.ngxService.stop();
                    this.isMobileNumberValidated = true;
                    this.toastrService.success('SUCCESS', 'Hurray! Now Submit your Enquiry!');
                    console.log("Success!!");
                    this.setMobileNumberInLocalStorage(true);
                    this.ref.detectChanges();
    })
    .catch( error => {
      this.ngxService.stop();
      this.isMobileNumberValidated = false; 
      this.toastrService.error('ERROR', 'Incorrect code entered?');
      console.log("OTP Failed!!", error.message);
      this.setMobileNumberInLocalStorage(false);
      this.ref.detectChanges();
    });
  }

  private setMobileNumberInLocalStorage(authenticated: boolean): void {
    const jsonData = JSON.stringify(authenticated ? this.mobileNumber : null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('mobileNumber', jsonData);
    }
  }

  private getMobileNumberInLocalStorage() {
    const mobileNumber = isPlatformBrowser(this.platformId) ? JSON.parse(localStorage.getItem('mobileNumber')) : {};
    return mobileNumber;
  }

  private resetMobile() {
    this.setMobileNumberInLocalStorage(false);
    this.mobileNumber = null;
    this.isValidMobileNumber = false;
    this.mobileNumberOtp = null;
    this.isMobileNumberEntered = false;
    this.isMobileNumberValidated = false;
  }

  scollTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  handleOnComplete = () => {
    this.setIsIntro2Visited();
    this.scollTop();
  }
  handleOnExit = (introJs) => {
    this.setIsIntro2Visited();
    this.scollTop();
  };

  ngOnDestroy() {
    clearInterval(this.introTimer);
  }
  
  private setIsIntro2Visited(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('isIntro2Visited', 'true');
    }
  }

  private getIsIntro2Visited() {
    return isPlatformBrowser(this.platformId) ? JSON.parse(localStorage.getItem('isIntro2Visited')) : {};
  }
}

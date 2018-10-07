import { AppPreloadingStrategy } from './app_preloading_strategy';
import { myAuthConfig } from './oauth_config';
import { Ng2UiAuthModule } from 'ng2-ui-auth';
import { EffectsModule } from '@ngrx/effects';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {TransferHttpCacheModule} from '@nguniversal/common';

// Components
import { AppComponent } from './app.component';
// Routes
import { routes } from './app.routes';
// Modules
import { SharedModule } from './shared/index';
import { UserModule } from './user/index';
import { HomeModule } from './home/index';
import { LayoutModule } from './layout/index';
import { CoreModule } from './core/index';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './app.reducers';
import { CheckoutHeaderComponent } from './layout/checkout-header/checkout-header.component';
import { CheckoutFooterComponent } from './layout/checkout-footer/checkout-footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    CheckoutHeaderComponent,
    CheckoutFooterComponent
  ],
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: AppPreloadingStrategy, initialNavigation: 'enabled' }),
    StoreModule.forRoot(reducers, { metaReducers }),

    !environment.production ? StoreDevtoolsModule.instrument() : [],

    EffectsModule.forRoot([]),
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'ng-spree' }),
    BrowserTransferStateModule,
    TransferHttpCacheModule,
    FormsModule,
    HttpModule,
    HomeModule,
    LayoutModule,
    Ng2UiAuthModule.forRoot(myAuthConfig),
    ToastrModule.forRoot({
      timeOut: 1500,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      progressAnimation: 'increasing'
    }),
    CoreModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [AppPreloadingStrategy],
  bootstrap: [AppComponent]
})
export class AppModule { }

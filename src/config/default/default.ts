import { DEFAULT_APP_DATA } from './app-data';
import { DEFAULT_META_DATA } from './meta-data';

export const DEFAULT_CONFIG = {
  // Add Your custom configs hereh
  // prodApiEndpoint: 'https://amazon-api.herokuapp.com/',
  // prodApiEndpoint: 'http://localhost:3000/',
  frontEndUrl: 'https://angularamazon.firebaseapp.com/',
  appName: 'Exa',
  fevicon: '/assets/default/favicon',
  header: {
    brand: {
      logo: '/assets/default/logo.svg',
      name: 'Exa',
      height: '42',
      width: '140'
    },
    searchPlaceholder: 'Your search for Most Exclusive Marble & Granite ends here',
    showGithubRibon: false
  },
  firebaseConfig: {
    apiKey: "AIzaSyAaZV9o1GeX3xFjlqlNnEsjY3i4IpON8-A",
    authDomain: "1538415571879.firebaseapp.com",
    databaseURL: "https://1538415571879.firebaseio.com",
    projectId: "amazon-1538415571879",
    storageBucket: "gs://amazon-1538415571879.appspot.com",
    messagingSenderId: "690488944028"
  },
  showDummyCardInfo: true,
  // Following are the test crediantials for payubiz payment gateway.
  payuBizSalt: 'eCwWELxi',
  payuBizKey: 'gtKFFx',
  freeShippingAmount: 50,
  currency_symbol: '₹', // USD $
  PaymentMethodCod: 'COD',
  PaymentMethodPayubiz: 'Payubiz',
  defaultPaymentMethod: 'Payubiz',
  reviewsDisplayLimit: 5,

  ...DEFAULT_APP_DATA,
  ...DEFAULT_META_DATA
};

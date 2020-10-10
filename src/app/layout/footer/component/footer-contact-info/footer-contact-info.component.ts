import { environment } from './../../../../../environments/environment';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '../../../../../../node_modules/@angular/common';
import * as introJs from '../../../../../../node_modules/intro.js/intro.js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-footer-contact-info',
  templateUrl: './footer-contact-info.component.html',
  styleUrls: ['./footer-contact-info.component.scss']
})
export class FooterContactInfoComponent implements OnInit {
  contact_info = environment.config.contact_info;
  introJS = introJs();
  constructor(@Inject(PLATFORM_ID) private platformId: any, private router: Router) {
    this.introJS.setOptions({
      steps: [
        {
          element: '#step1',
          intro: 'Click to connect over call',
          position: 'bottom'
        },
        {
          element: '#step2',
          intro: "Click to connect over whatsapp",
          position: 'bottom'
        },
        {
          element: '#step4',
          intro: 'Click to view more Products. (Click Done)',
          position: 'top'
        }
      ],
      showProgress: true
    });
    this.introJS.oncomplete(this.handleOnComplete);
    this.introJS.onexit(() => this.handleOnExit(introJs));
  }

  ngOnInit() {
    console.log("The URL is:", this.router.url);
    if(this.router.url === '/') {
      setTimeout(() => this.introJS.start(), 6000);
    }
  }
  scollTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  handleOnComplete = () => {
    this.scollTop();
  }
  handleOnExit = (introJs) => {
    this.scollTop();
  };
}

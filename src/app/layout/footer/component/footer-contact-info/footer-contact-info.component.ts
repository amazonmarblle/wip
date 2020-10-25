import { environment } from './../../../../../environments/environment';
import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '../../../../../../node_modules/@angular/common';
import * as introJs from '../../../../../../node_modules/intro.js/intro.js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-footer-contact-info',
  templateUrl: './footer-contact-info.component.html',
  styleUrls: ['./footer-contact-info.component.scss']
})
export class FooterContactInfoComponent implements OnInit, OnDestroy {
  contact_info = environment.config.contact_info;
  introJS = introJs();
  introTimer;
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
    if(this.router.url === '/' && this.getIsIntro2Visited() !== true) {
      this.introTimer = setTimeout(() => this.introJS.start(), 7000);
    }
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
      localStorage.setItem('isIntro1Visited', 'true');
    }
  }

  private getIsIntro2Visited() {
    return isPlatformBrowser(this.platformId) ? JSON.parse(localStorage.getItem('isIntro1Visited')) : {};
  }
}

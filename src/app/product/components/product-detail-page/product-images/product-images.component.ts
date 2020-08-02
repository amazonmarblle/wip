import { Image } from './../../../../core/models/image';
import { environment } from './../../../../../environments/environment';
import { Product } from './../../../../core/models/product';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';

@Component({
  selector: 'app-image-container',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductImagesComponent implements OnInit {
  @Input() images: Image[] = null;
  @Input() selectedImage: Image = null;
  zoomOptions = {
    peepView: {
      borderColor: '#fff',
      borderWidth: '2px',
      borderStyle: 'solid',
      cursor: 'zoom-in',
    },
    settings: {
      zoom: 4,
    }
  };
  @Input() isMobile;
  public carouselOne: NguCarouselConfig;
  constructor() { }

  ngOnInit() {
    this.carouselOne = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      slide: 1,
      speed: 400,
      interval: {timing: 3000, initialDelay: 1000},
      point: {
        visible: true,
        hideOnSingleSlide: true // To apply our modification
      },
      load: 2,
      touch: true,
      loop: true,
      // easing: 'ease-in',
      custom: 'banner'
    };
  }


  getProductImageUrl(url) {
    return url;
  }

  onMouseOver(image: Image) {
    this.selectedImage = image;
  }
}

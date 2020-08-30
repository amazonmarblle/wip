const cdn_url = 'https://res.cloudinary.com/aviabird/image/upload/q_60/v1529433193/angularspree/';

export const DEFAULT_APP_DATA = {
  landing_page_banner: [
    {
      image_link: `https://firebasestorage.googleapis.com/v0/b/amazon-1538415571879.appspot.com/o/amazon%2FlandingPage%2FTest.gif?alt=media&token=9d32d979-7b29-4c14-95f4-c47a9f14538b`,
      link_url: '#'
    },
    {
      image_link: `https://firebasestorage.googleapis.com/v0/b/amazon-1538415571879.appspot.com/o/amazon%2FlandingPage%2Fbanner_2.jpg?alt=media&token=682fdc90-3e02-4f7a-a02b-ddecbd8a2671`,
      link_url: '#'
    },
    {
      image_link: `https://firebasestorage.googleapis.com/v0/b/amazon-1538415571879.appspot.com/o/amazon%2FlandingPage%2Fbanner-3.jpg?alt=media&token=e14beca9-9a11-4d2f-bcd5-acdb4e39e6cc`,
      link_url: '#'
    },
    {
      image_link: `https://firebasestorage.googleapis.com/v0/b/amazon-1538415571879.appspot.com/o/amazon%2FlandingPage%2Fbanner-4.jpg?alt=media&token=76003fea-e0e5-4b82-bb31-b8bcafd95092`,
      link_url: '#'
    }
  ],
  promo_banner: {
    image_link: `https://firebasestorage.googleapis.com/v0/b/amazon-1538415571879.appspot.com/o/amazon%2FlandingPage%2FpromoBanner.png?alt=media&token=30d886e3-e84b-47c6-bac5-0afa9587aaf3`,
    link_url: '#'
  },
  category_banner: {
    Living: {
      image_link: `${cdn_url}banner-1.jpg`,
      link_url: '#'
    },
    Bedroom: {
      image_link: `${cdn_url}banner-2.jpg`,
      link_url: '#'
    },
    Dining: {
      image_link: `${cdn_url}banner-3.jpg`,
      link_url: '#'
    },
    Study: {
      image_link: `${cdn_url}banner-4.jpg`,
      link_url: '#'
    }
  },
  Deals: {
    type: 'New Arrivals'
  },

  footer_page_links: [
    {
      name: 'About Us',
      link_url: '#'
    },
    {
      name: 'Blog',
      link_url: '#'
    },
    {
      name: 'Return Policy',
      link_url: '#'
    },
    {
      name: 'FAQs',
      link_url: '#'
    },
    {
      name: 'Testimonials',
      link_url: '#'
    }
  ],
  footer_social_links: [
    {
      link_url: 'https://twitter.com/XYZ',
      name: 'Twitter',
      icon: 'fa fa-twitter-square'
    },
    {
      link_url: 'https://www.instagram.com/XYZ/',
      name: 'Instagram',
      icon: 'fa fa-instagram'
    },
    {
      link_url:
        'https://plus.google.com/b/XYZ',
      name: 'Google +',
      icon: 'fa fa-google-plus-square'
    },
    {
      link_url: 'https://in.pinterest.com/XYZ/',
      name: 'Pinterest',
      icon: 'fa fa-pinterest-square'
    },
    {
      link_url: 'https://www.facebook.com/XYZ/',
      name: 'Facebook',
      icon: 'fa fa-facebook-square'
    },
    {
      link_url: 'https://www.youtube.com/channel/XYZ',
      name: 'Youtube',
      icon: 'fa fa-youtube-square'
    }
  ],
  contact_info: {
    contact_no: '99576-08288',
    copyright: 'Copyright © 2020 Amazon, Inc.'
  }
};

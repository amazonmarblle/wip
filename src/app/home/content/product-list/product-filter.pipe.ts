import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { Product } from './../../../core/models/product';

/**
 * Filter the products based on selected taxons in the sidebar
 * @name filter
 * @param selectedTaxonids
 */
@Pipe({
  name: 'filter'
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform(products: Product[], selectedTaxonIds: number[]): any[] {
    const equalIndex = location.href.indexOf('id=');
    const length = location.href.length;
    console.log('Filtering ' + products.length + ' products ' + ' using taxonId: ' + Number(location.href.substring(equalIndex+3,length)));
    const selectedIds = [Number(location.href.substring(equalIndex+3,length))];
    if (!products) {
      return [];
    }
    if (!selectedIds || selectedIds.length === 0) {
      return products;
    }
    return products.filter(product => {
      let productPresent = false;
      selectedIds.forEach(id => {
        if (product.taxon_ids.findIndex(taxon_id => taxon_id === id) !== -1) {
          productPresent = true;
        }
      });
      return productPresent;
    });
  }
}

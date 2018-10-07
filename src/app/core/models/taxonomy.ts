import { Taxon } from './taxon';

export interface Taxonomy {
  id: number;
  name: string;
  root: Taxon;
}

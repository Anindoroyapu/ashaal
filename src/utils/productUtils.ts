import { Product, ProductVariationOption } from '../types';

export function getEffectivePrice(product: Product, selectedVariations?: Record<string, string>): number {
  let price = product.final_price || product.price;

  if (product.variations && selectedVariations && Object.keys(selectedVariations).length > 0) {
    product.variations.forEach(v => {
      const selectedOptName = selectedVariations[v.name];
      if (selectedOptName) {
        const opt = v.options.find(o => (typeof o === 'string' ? o : o.name) === selectedOptName);
        if (opt && typeof opt !== 'string' && opt.price !== undefined && opt.price !== null) {
          price = opt.price;
        }
      }
    });
  }

  return price;
}

export function getEffectiveStock(product: Product, selectedVariations?: Record<string, string>): number {
  let stock = product.inStock || 0;

  if (product.variations && selectedVariations && Object.keys(selectedVariations).length > 0) {
    product.variations.forEach(v => {
      const selectedOptName = selectedVariations[v.name];
      if (selectedOptName) {
        const opt = v.options.find(o => (typeof o === 'string' ? o : o.name) === selectedOptName);
        if (opt && typeof opt !== 'string' && opt.stock !== undefined && opt.stock !== null) {
          stock = opt.stock;
        }
      }
    });
  }

  return stock;
}


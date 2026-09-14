const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');

// 1. We need to replace the variation handlers.
const oldHandlersStart = '// Variations handlers';
const oldHandlersEnd = '// Save Product (from dedicated page)';

const startIndex = code.indexOf(oldHandlersStart);
const endIndex = code.indexOf(oldHandlersEnd);

if (startIndex > -1 && endIndex > -1) {
  const newHandlers = `// Variations handlers
  const handleAddVariation = () => {
    const newVar = { id: \`var-\${Date.now()}\`, name: "", options: [] };
    setEditingProduct(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        variations: [...(prev.variations || []), newVar]
      };
    });
  };

  const handleUpdateVariationName = (idx: number, name: string) => {
    setEditingProduct(prev => {
      if (!prev || !prev.variations) return prev;
      const newVars = [...prev.variations];
      newVars[idx] = { ...newVars[idx], name };
      return { ...prev, variations: newVars };
    });
  };

  const handleRemoveVariation = (idx: number) => {
    setEditingProduct(prev => {
      if (!prev || !prev.variations) return prev;
      const newVars = [...prev.variations];
      newVars.splice(idx, 1);
      return { ...prev, variations: newVars };
    });
  };

  const handleAddVariationOption = (idx: number) => {
    setEditingProduct(prev => {
      if (!prev || !prev.variations) return prev;
      const newVars = [...prev.variations];
      newVars[idx] = { 
        ...newVars[idx], 
        options: [...newVars[idx].options, { name: "", price: undefined, stock: undefined }] 
      };
      return { ...prev, variations: newVars };
    });
  };

  const handleUpdateVariationOption = (varIdx: number, optIdx: number, field: string, value: any) => {
    setEditingProduct(prev => {
      if (!prev || !prev.variations) return prev;
      const newVars = [...prev.variations];
      const newOptions = [...newVars[varIdx].options];
      
      let opt = newOptions[optIdx];
      if (typeof opt === 'string') {
        opt = { name: opt };
      } else {
        opt = { ...opt };
      }
      
      (opt as any)[field] = value;
      newOptions[optIdx] = opt;
      
      newVars[varIdx] = { ...newVars[varIdx], options: newOptions };
      return { ...prev, variations: newVars };
    });
  };

  const handleRemoveVariationOption = (varIdx: number, optIdx: number) => {
    setEditingProduct(prev => {
      if (!prev || !prev.variations) return prev;
      const newVars = [...prev.variations];
      const newOptions = [...newVars[varIdx].options];
      newOptions.splice(optIdx, 1);
      newVars[varIdx] = { ...newVars[varIdx], options: newOptions };
      return { ...prev, variations: newVars };
    });
  };

  `;
  
  code = code.substring(0, startIndex) + newHandlers + code.substring(endIndex);
}

// 2. We need to replace the variation UI.
const uiStart = '{/* CARD 3.5: Product Variations */}';
const uiEnd = '{/* RIGHT SIDEBAR (4 COLS): Pricing, Inventory, Categorization, Badges */}';

const uiStartIndex = code.indexOf(uiStart);
const uiEndIndex = code.indexOf(uiEnd);

if (uiStartIndex > -1 && uiEndIndex > -1) {
  const newUI = `{/* CARD 3.5: Product Variations */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Product Variations</h3>
                        <p className="text-xs text-slate-400">Add colors, sizes, or other options with specific prices/stock</p>
                      </div>
                      <button type="button" onClick={handleAddVariation} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                        + Add Variation
                      </button>
                    </div>
                    
                    {(!editingProduct.variations || editingProduct.variations.length === 0) && (
                      <p className="text-xs text-slate-500 text-center py-4">No variations added. This product has only one standard option.</p>
                    )}

                    {editingProduct.variations?.map((variation, vIdx) => (
                      <div key={variation.id} className="p-5 border border-slate-200 rounded-xl bg-slate-50 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Variation Type</label>
                            <input 
                              type="text" 
                              placeholder="e.g., Color, Size, Storage" 
                              value={variation.name}
                              onChange={(e) => handleUpdateVariationName(vIdx, e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                            />
                          </div>
                          <button type="button" onClick={() => handleRemoveVariation(vIdx)} className="p-2.5 mt-5 text-red-500 hover:bg-red-100 rounded-lg font-bold text-xs transition-colors" title="Remove Variation">
                            Remove
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Options</label>
                          </div>
                          
                          <div className="space-y-2">
                            {variation.options.map((opt, oIdx) => {
                              const optName = typeof opt === 'string' ? opt : opt.name;
                              const optPrice = typeof opt === 'string' ? '' : opt.price ?? '';
                              const optStock = typeof opt === 'string' ? '' : opt.stock ?? '';
                              
                              return (
                                <div key={oIdx} className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
                                  <input 
                                    type="text" 
                                    placeholder="Option Name (e.g. Red, XL)" 
                                    value={optName}
                                    onChange={(e) => handleUpdateVariationOption(vIdx, oIdx, 'name', e.target.value)}
                                    className="flex-1 min-w-[120px] px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:border-emerald-500"
                                  />
                                  <input 
                                    type="number" 
                                    placeholder="Override Price (৳)" 
                                    value={optPrice}
                                    onChange={(e) => handleUpdateVariationOption(vIdx, oIdx, 'price', e.target.value ? Number(e.target.value) : undefined)}
                                    className="w-[130px] px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:border-emerald-500"
                                    title="Leave blank to use base price"
                                  />
                                  <input 
                                    type="number" 
                                    placeholder="Override Stock" 
                                    value={optStock}
                                    onChange={(e) => handleUpdateVariationOption(vIdx, oIdx, 'stock', e.target.value ? Number(e.target.value) : undefined)}
                                    className="w-[120px] px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:border-emerald-500"
                                    title="Leave blank to use base stock"
                                  />
                                  <button type="button" onClick={() => handleRemoveVariationOption(vIdx, oIdx)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                          
                          <button 
                            type="button" 
                            onClick={() => handleAddVariationOption(vIdx)}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mt-2 cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            Add Option
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                `;
                
  code = code.substring(0, uiStartIndex) + newUI + code.substring(uiEndIndex);
}

fs.writeFileSync('src/views/AdminManagePage.tsx', code);
console.log('Successfully patched AdminManagePage variation UI');


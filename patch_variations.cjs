const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');

// Injecting the handlers
const handlers = `
  // Variations handlers
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

  const handleAddVariationOption = (idx: number, option: string) => {
    if (!option.trim()) return;
    setEditingProduct(prev => {
      if (!prev || !prev.variations) return prev;
      const newVars = [...prev.variations];
      if (!newVars[idx].options.includes(option.trim())) {
        newVars[idx] = { ...newVars[idx], options: [...newVars[idx].options, option.trim()] };
      }
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

  // Save Product (from dedicated page)
`;

code = code.replace(
  '  // Save Product (from dedicated page)',
  handlers
);

// Injecting the UI
const ui = `                  {/* CARD 3.5: Product Variations */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Product Variations</h3>
                        <p className="text-xs text-slate-400">Add colors, sizes, or other options</p>
                      </div>
                      <button type="button" onClick={handleAddVariation} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                        + Add Variation
                      </button>
                    </div>
                    
                    {(!editingProduct.variations || editingProduct.variations.length === 0) && (
                      <p className="text-xs text-slate-500 text-center py-4">No variations added. This product has only one standard option.</p>
                    )}

                    {editingProduct.variations?.map((variation, vIdx) => (
                      <div key={variation.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            placeholder="Variation Name (e.g., Color, Size)" 
                            value={variation.name}
                            onChange={(e) => handleUpdateVariationName(vIdx, e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          />
                          <button type="button" onClick={() => handleRemoveVariation(vIdx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg font-bold text-xs" title="Remove Variation">
                            Remove
                          </button>
                        </div>
                        
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Options</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {variation.options.map((opt, oIdx) => (
                              <span key={oIdx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium flex items-center gap-1.5 shadow-sm">
                                {opt}
                                <button type="button" onClick={() => handleRemoveVariationOption(vIdx, oIdx)} className="text-slate-400 hover:text-red-500 font-bold ml-1">x</button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Add option (e.g., Red, XL) and press Enter" 
                              className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddVariationOption(vIdx, e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button 
                              type="button" 
                              className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling;
                                handleAddVariationOption(vIdx, input.value);
                                input.value = '';
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                {/* RIGHT SIDEBAR (4 COLS): Pricing, Inventory, Categorization, Badges */}`;

code = code.replace(
  '{/* RIGHT SIDEBAR (4 COLS): Pricing, Inventory, Categorization, Badges */}',
  ui
);

fs.writeFileSync('src/views/AdminManagePage.tsx', code);
console.log('Successfully patched variations UI');


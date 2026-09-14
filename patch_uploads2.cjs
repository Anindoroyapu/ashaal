const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');

const handlerCode = `
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        if (isGallery) {
          setEditingProduct({
            ...editingProduct,
            images: [...(editingProduct.images || []), data.url]
          });
        } else {
          setEditingProduct({
            ...editingProduct,
            mainImage: data.url
          });
        }
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading image");
    } finally {
      setIsUploadingImage(false);
    }
  };
`;

code = code.replace(
  'const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);',
  'const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);\n' + handlerCode
);

const mainImgRegex = /<label className="block text-xs font-bold text-slate-700">[\s\n]*Primary Cover Image URL \*[\s\n]*<\/label>[\s\n]*<input[\s\n]*type="url"[\s\n]*required[\s\n]*value=\{editingProduct\.mainImage \|\| ""\}[\s\n]*onChange=\{\(e\) =>[\s\n]*setEditingProduct\(\{[\s\n]*\.\.\.editingProduct,[\s\n]*mainImage: e\.target\.value,[\s\n]*\}\)[\s\n]*\}[\s\n]*placeholder="https:\/\/images\.unsplash\.com\/\.\.\."[\s\n]*className="w-full px-4 py-2\.5 bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs rounded-xl focus:ring-2 focus:ring-emerald-500\/20 focus:border-emerald-500 focus:bg-white"[\s\n]*\/>/;

const newMainImageTarget = `<label className="block text-xs font-bold text-slate-700">
                            Primary Cover Image (Upload or URL) *
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, false)}
                              className="w-full sm:w-1/2 px-2 py-2 bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl cursor-pointer"
                              disabled={isUploadingImage}
                            />
                            <span className="text-xs font-bold text-slate-400">OR</span>
                            <input
                              type="url"
                              value={editingProduct.mainImage || ""}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  mainImage: e.target.value,
                                })
                              }
                              placeholder="Paste URL..."
                              className="w-full sm:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                            />
                          </div>
                          {isUploadingImage && <p className="text-xs text-blue-600 font-bold animate-pulse mt-1">Uploading...</p>}`;

code = code.replace(mainImgRegex, newMainImageTarget);

const galleryImgRegex = /<input[\s\n]*type="url"[\s\n]*value=\{newGalleryImageUrl\}[\s\n]*onChange=\{\(e\) =>[\s\n]*setNewGalleryImageUrl\(e\.target\.value\)[\s\n]*\}[\s\n]*placeholder="Paste additional gallery image URL\.\.\."[\s\n]*className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs rounded-xl focus:ring-2 focus:ring-emerald-500\/20 focus:border-emerald-500 focus:bg-white"[\s\n]*\/>[\s\n]*<button[\s\n]*type="button"[\s\n]*onClick=\{handleAddGalleryImage\}[\s\n]*className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"[\s\n]*>[\s\n]*Add Image[\s\n]*<\/button>/;

const newGalleryImageTarget = `<div className="flex flex-col w-full gap-2">
                          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, true)}
                              className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl cursor-pointer"
                              disabled={isUploadingImage}
                            />
                            <span className="text-xs font-bold text-slate-400">OR</span>
                            <div className="flex flex-1 gap-2 w-full">
                              <input
                                type="url"
                                value={newGalleryImageUrl}
                                onChange={(e) =>
                                  setNewGalleryImageUrl(e.target.value)
                                }
                                placeholder="Paste URL..."
                                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                              />
                              <button
                                type="button"
                                onClick={handleAddGalleryImage}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap"
                              >
                                Add URL
                              </button>
                            </div>
                          </div>
                          {isUploadingImage && <p className="text-xs text-blue-600 font-bold animate-pulse">Uploading gallery image...</p>}
                        </div>`;

code = code.replace(galleryImgRegex, newGalleryImageTarget);

fs.writeFileSync('src/views/AdminManagePage.tsx', code);
console.log('Main image replaced:', code.includes('Primary Cover Image (Upload or URL) *'));
console.log('Gallery image replaced:', code.includes('Uploading gallery image...'));


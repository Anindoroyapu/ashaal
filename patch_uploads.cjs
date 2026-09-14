const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');

// Inject the state and handler
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

// Replace the main image input area with file upload and url input side-by-side
const mainImageTarget = `                        <div className="flex-1 space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700">
                            Primary Product Image URL *
                          </label>
                          <input
                            type="url"
                            required
                            value={editingProduct.mainImage || ""}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                mainImage: e.target.value,
                              })
                            }
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                          />
                        </div>`;

const newMainImageTarget = `                        <div className="flex-1 space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700">
                            Primary Product Image (Upload or URL) *
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, false)}
                              className="w-full px-2 py-2 bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl cursor-pointer"
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
                              placeholder="https://..."
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                            />
                          </div>
                          {isUploadingImage && <p className="text-xs text-blue-600 font-bold animate-pulse">Uploading...</p>}
                        </div>`;

code = code.replace(mainImageTarget, newMainImageTarget);


// Replace the gallery image input
const galleryImageTarget = `                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newGalleryImageUrl}
                          onChange={(e) =>
                            setNewGalleryImageUrl(e.target.value)
                          }
                          placeholder="Paste additional gallery image URL..."
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddGalleryImage}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Add Image
                        </button>
                      </div>`;

const newGalleryImageTarget = `                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, true)}
                            className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl cursor-pointer"
                            disabled={isUploadingImage}
                          />
                          <span className="text-xs font-bold text-slate-400">OR</span>
                          <input
                            type="url"
                            value={newGalleryImageUrl}
                            onChange={(e) =>
                              setNewGalleryImageUrl(e.target.value)
                            }
                            placeholder="Paste image URL..."
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
                        {isUploadingImage && <p className="text-xs text-blue-600 font-bold animate-pulse">Uploading gallery image...</p>}
                      </div>`;

code = code.replace(galleryImageTarget, newGalleryImageTarget);

fs.writeFileSync('src/views/AdminManagePage.tsx', code);
console.log('Successfully patched image uploads');


import { useEffect, useState } from "react";

type LinkPreview = {
  title: string | null;
  description: string | null;
  image: string | null;
  url: string;
};

const REGISTRY_URL =
  "https://www.myregistry.com/wedding-registry/ysabel-espinosa-and-steve-flores-victorville-ca/5360734/giftlist?publicUrlName=ysasteve-registry";
const VENMO_URL = "https://account.venmo.com/u/Steve-Flores-51";

const Registry = () => {
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(true);

  useEffect(() => {
    const loadPreview = async (url: string) => {
      const response = await fetch(`/api/v1/link-preview?url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        throw new Error("Unable to load link preview");
      }

      return (await response.json()) as LinkPreview;
    };

    const loadRegistryPreview = async () => {
      try {
        const data = await loadPreview(REGISTRY_URL);
        setPreview(data);
      } catch {
        setPreview(null);
      } finally {
        setLoadingPreview(false);
      }
    };

    loadRegistryPreview();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl px-4 py-6">
        <h1>Donation fund :)</h1>
        <a href={VENMO_URL} target="_blank" rel="noreferrer" className="mb-4 block overflow-hidden rounded-lg border bg-sky-50">
          <div className="flex items-center gap-4 p-4 sm:p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-xl font-bold text-white">V</div>
            <div>
              <h2 className="font-semibold">Venmo</h2>
              <p className="text-sm text-gray-700">@Steve-Flores-51</p>
            </div>
          </div>
        </a>

        <h1>Registry</h1>
        {preview?.image && (
          <a href={REGISTRY_URL} target="_blank" rel="noreferrer" className="mb-4 block overflow-hidden rounded-lg border">
            <img src={preview.image} alt={preview.title ?? "Registry preview"} className="h-56 w-full object-cover sm:h-72" />
            <div className="p-3">
              <h2 className="font-semibold">{preview.title ?? "Our Registry"}</h2>
              {preview.description && <p className="mt-1 text-sm text-gray-600">{preview.description}</p>}
            </div>
          </a>
        )}

        {!preview?.image && !loadingPreview && (
          <p className="mb-4 text-center text-sm text-gray-600">Could not load link image preview, but the registry link still works below.</p>
        )}
      </div>
    </div>
  );
};

export default Registry;

import { useEffect, useMemo, useRef, useState } from "react";
import { MdOutlineCollections, MdOutlineRefresh } from "react-icons/md";

const INITIAL_VISIBLE_COUNT = 20;
const LOAD_MORE_COUNT = 10;

type GalleryPhoto = {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
};

type UploadedGalleryProps = {
  refreshKey: number;
};

const UploadedGallery = ({ refreshKey }: UploadedGalleryProps) => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const visiblePhotos = useMemo(() => photos.slice(0, visibleCount), [photos, visibleCount]);
  const hasMorePhotos = visibleCount < photos.length;

  const loadGallery = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/v1/photos", {
        credentials: "include",
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || "Unable to load gallery");
      }

      setPhotos(Array.isArray(payload.photos) ? payload.photos : []);
      setVisibleCount(INITIAL_VISIBLE_COUNT);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load gallery";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, [refreshKey]);

  useEffect(() => {
    if (!hasMorePhotos || !loadMoreRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting) {
          return;
        }

        setVisibleCount((current) => Math.min(current + LOAD_MORE_COUNT, photos.length));
      },
      {
        rootMargin: "300px 0px",
      },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMorePhotos, photos.length, visibleCount]);

  return (
    <section className="mt-10 rounded-3xl border border-primary/25 bg-white/75 p-5 shadow-[0_20px_50px_-30px_rgba(85,120,94,0.45)] backdrop-blur-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="inline-flex rounded-full border border-secondary/60 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-textcolor">
            Guest Gallery
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-textcolor sm:text-3xl">Moments Shared By Everyone</h2>
          <p className="mt-1 text-sm text-textcolor/75">Tap any image to open it in a new tab.</p>
        </div>
        <button
          type="button"
          onClick={loadGallery}
          className="inline-flex items-center gap-2 rounded-xl border border-primary/35 bg-white px-3 py-2 text-sm font-semibold text-textcolor hover:bg-background"
        >
          <MdOutlineRefresh className="h-5 w-5" aria-hidden="true" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-xl bg-white-accent sm:h-40" />
          ))}
        </div>
      ) : null}

      {!loading && errorMessage ? (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
      ) : null}

      {!loading && !errorMessage && photos.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-secondary/35 bg-background/75 p-8 text-center">
          <MdOutlineCollections className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
          <p className="mt-3 text-sm text-textcolor/75">No guest uploads yet. Be the first to share a photo.</p>
        </div>
      ) : null}

      {!loading && !errorMessage && photos.length > 0 ? (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visiblePhotos.map((photo) => (
              <a
                key={photo.filename}
                href={photo.url}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden rounded-xl border border-primary/20 bg-white"
              >
                <img
                  src={photo.url}
                  alt="Guest uploaded wedding memory"
                  loading="lazy"
                  className="h-32 w-full object-cover transition duration-300 group-hover:scale-[1.03] sm:h-40"
                />
              </a>
            ))}
          </div>

          {hasMorePhotos ? (
            <div ref={loadMoreRef} className="mt-5 flex justify-center">
              <div className="rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-textcolor/70 backdrop-blur">
                Loading more memories...
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
};

export default UploadedGallery;

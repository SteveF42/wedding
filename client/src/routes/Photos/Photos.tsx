import { useEffect, useMemo, useRef, useState } from "react";
import { MdCloudUpload, MdOutlinePhotoLibrary } from "react-icons/md";
import UploadedGallery from "./UploadedGallery";

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
const MAX_FILES_PER_UPLOAD = 20;

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Photos = () => {
  const isTodayWedding = useMemo(() => new Date() >= new Date("2026-08-8"), []);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0);

  const previewItems = useMemo(
    () =>
      selectedFiles.map((file) => ({
        file,
        id: `${file.name}-${file.lastModified}-${file.size}`,
        url: URL.createObjectURL(file),
      })),
    [selectedFiles],
  );

  useEffect(() => {
    return () => {
      previewItems.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewItems]);

  const clearStatus = () => {
    setStatusMessage("");
    setIsError(false);
  };

  const validateAndSetFiles = (fileList: FileList | File[]) => {
    clearStatus();
    const incomingFiles = Array.from(fileList);

    if (!incomingFiles.length) {
      return;
    }

    const validFiles = incomingFiles.filter((file) => file.type.startsWith("image/") && file.size <= MAX_FILE_SIZE_BYTES);
    const invalidCount = incomingFiles.length - validFiles.length;

    if (!validFiles.length) {
      setIsError(true);
      setStatusMessage("Please choose image files under 15MB.");
      return;
    }

    setSelectedFiles((previousFiles) => {
      const availableSlots = Math.max(0, MAX_FILES_PER_UPLOAD - previousFiles.length);
      const filesToAdd = validFiles.slice(0, availableSlots);

      const dedupedNewFiles = filesToAdd.filter(
        (newFile) =>
          !previousFiles.some(
            (existingFile) =>
              existingFile.name === newFile.name && existingFile.size === newFile.size && existingFile.lastModified === newFile.lastModified,
          ),
      );

      return [...previousFiles, ...dedupedNewFiles];
    });

    const wasTrimmed = selectedFiles.length + validFiles.length > MAX_FILES_PER_UPLOAD;
    if (invalidCount > 0 || wasTrimmed) {
      setIsError(true);
      setStatusMessage("Some files were skipped. Please upload image files under 15MB and max 20 photos at a time.");
    }
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    validateAndSetFiles(event.target.files);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    if (!event.dataTransfer.files.length) return;
    validateAndSetFiles(event.dataTransfer.files);
  };

  const uploadPhoto = async () => {
    if (!selectedFiles.length || isUploading) return;

    setIsUploading(true);
    clearStatus();

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("photos", file);
      });

      const response = await fetch("/api/v1/photos/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || "Upload failed. Please try again.");
      }

      const uploadedUrls: string[] = Array.isArray(payload.photos)
        ? payload.photos.map((photo: { url?: string }) => photo.url).filter((url: string | undefined): url is string => !!url)
        : [];

      setStatusMessage(`Uploaded ${uploadedUrls.length || selectedFiles.length} photo(s) successfully. Thank you for sharing your memories.`);
      setSelectedFiles([]);
      setGalleryRefreshKey((previous) => previous + 1);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      setIsError(true);
      const message = error instanceof Error ? error.message : "Upload failed. Please try again.";
      setStatusMessage(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="relative isolate overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 " />

      <section className="mx-auto w-full max-w-5xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="inline-flex rounded-full border border-secondary/60 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-textcolor backdrop-blur">
            Shared Memories
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-textcolor sm:text-5xl">Photo Portal</h1>
          <p className="mt-3 text-sm text-textcolor/75 sm:text-base">
            Upload your favorite moments from the wedding day so everyone can relive them.
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <article className="rounded-3xl border border-primary/25 bg-white/80 p-5 shadow-[0_20px_50px_-30px_rgba(85,120,94,0.45)] backdrop-blur-sm sm:p-6">
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragOver(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragOver(false);
              }}
              onDrop={onDrop}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              className={[
                "group relative rounded-2xl border-2 border-dashed p-7 text-center transition-all sm:p-10",
                isDragOver
                  ? "border-primary bg-primary/8 shadow-[0_0_0_4px_rgba(119,175,156,0.14)]"
                  : "border-secondary/55 bg-background/75 hover:border-primary/70 hover:bg-primary/6",
              ].join(" ")}>
              <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onFileInputChange} />

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white-accent text-primary shadow-sm">
                <MdCloudUpload className="h-9 w-9" aria-hidden="true" />
              </div>

              <h2 className="mt-4 text-xl font-semibold text-textcolor">Upload Photos</h2>
              <p className="mt-2 text-sm text-textcolor/75">tap to upload photos from your device</p>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-textcolor/60">PNG, JPG, HEIC up to 15MB each, max 20</p>
            </div>

            {selectedFiles.length ? (
              <div className="mt-5 rounded-2xl border border-primary/20 bg-white-accent/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-textcolor">
                      {selectedFiles.length} photo{selectedFiles.length === 1 ? "" : "s"} selected
                    </p>
                    <p className="mt-1 text-xs text-textcolor/70">{formatFileSize(selectedFiles.reduce((sum, file) => sum + file.size, 0))} total</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-textcolor/20 px-3 py-1 text-xs font-semibold text-textcolor hover:bg-white/60"
                    onClick={() => {
                      setSelectedFiles([]);
                      clearStatus();
                      if (inputRef.current) {
                        inputRef.current.value = "";
                      }
                    }}>
                    Clear all
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {previewItems.slice(0, 6).map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-xl border border-primary/15 bg-white">
                      <img src={item.url} alt={item.file.name} className="h-28 w-full object-cover sm:h-32" />
                    </div>
                  ))}
                </div>
                {previewItems.length > 6 ? <p className="mt-2 text-xs text-textcolor/70">+{previewItems.length - 6} more selected</p> : null}
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={uploadPhoto}
                disabled={!selectedFiles.length || isUploading || !isTodayWedding}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50">
                {isUploading ? "Uploading..." : `Upload ${selectedFiles.length || ""} Photo${selectedFiles.length === 1 ? "" : "s"}`}
              </button>
              <p className="text-xs text-textcolor/70">Your photos are sent securely to our server for permanent storage.</p>
            </div>
            {!isTodayWedding && (
              <p className="mt-4 rounded-lg border px-3 py-2 text-sm text-red-700 bg-red-50 border-red-200 p-2">Today is not the wedding :(</p>
            )}
            {statusMessage ? (
              <p
                role="status"
                className={[
                  "mt-4 rounded-lg border px-3 py-2 text-sm",
                  isError ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700",
                ].join(" ")}>
                {statusMessage}
              </p>
            ) : null}
          </article>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-secondary/40 bg-white/85 p-5 shadow-[0_20px_50px_-34px_rgba(85,120,94,0.45)] backdrop-blur-sm">
              <div className="inline-flex rounded-xl bg-white-accent p-2 text-primary">
                <MdOutlinePhotoLibrary className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-3 text-lg font-semibold text-textcolor">Photo Tips</h2>
              <ul className="mt-3 space-y-2 text-sm text-textcolor/80">
                <li>Use landscape photos for best gallery framing.</li>
                <li>Group shots and candid moments are both welcome.</li>
                <li>Please avoid uploading screenshots or blurry captures.</li>
              </ul>
            </div>
          </aside>
        </div>

        <UploadedGallery refreshKey={galleryRefreshKey} />
      </section>
    </main>
  );
};

export default Photos;

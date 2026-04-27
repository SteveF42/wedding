const REGISTRY_URL =
  "https://www.myregistry.com/wedding-registry/ysabel-espinosa-and-steve-flores-victorville-ca/5360734/giftlist?publicUrlName=ysasteve-registry";
const VENMO_URL = "https://account.venmo.com/u/Steve-Flores-51";

const Registry = () => {
  return (
    <main className="relative isolate overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 " />

      <div className="flex justify-center">
        <div className="w-full max-w-3xl px-4 py-6">
          <p className="mx-auto flex w-fit rounded-full border border-secondary/60 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-textcolor backdrop-blur">
            Wedding Gifts
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-textcolor sm:text-4xl">Donation fund :)</h1>
          <a
            href={VENMO_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 mb-6 block overflow-hidden rounded-2xl border border-sky-200/80 bg-white/90 shadow-[0_18px_40px_-24px_rgba(14,116,144,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_-24px_rgba(14,116,144,0.5)]">
            <div className="flex items-center gap-4 p-4 sm:p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-xl font-bold text-white">V</div>
              <div>
                <h2 className="font-semibold text-sky-900">Venmo</h2>
                <p className="text-sm text-gray-700">@Steve-Flores-51</p>
              </div>
            </div>
          </a>

          <h2 className="text-2xl font-semibold text-textcolor">Registry</h2>
          <a
            href={REGISTRY_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 mb-4 block overflow-hidden rounded-2xl border border-primary/25 bg-white/90 shadow-[0_20px_50px_-30px_rgba(85,120,94,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-30px_rgba(85,120,94,0.5)]">
            <img
              src={"https://www.myregistry.com/Images/Visitors/mr-share-image-Wedding.jpg"}
              alt={"Registry preview"}
              className="h-56 w-full object-cover sm:h-72"
            />
            <div className="p-4">
              <h3 className="font-semibold text-textcolor">Shop Ysabel and Steve</h3>
              <p className="mt-1 text-sm text-textcolor/75">Find the perfect gift - no app download needed!</p>
            </div>
          </a>
        </div>
      </div>
    </main>
  );
};

export default Registry;

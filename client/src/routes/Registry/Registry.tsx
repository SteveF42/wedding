
const REGISTRY_URL =
  "https://www.myregistry.com/wedding-registry/ysabel-espinosa-and-steve-flores-victorville-ca/5360734/giftlist?publicUrlName=ysasteve-registry";
const VENMO_URL = "https://account.venmo.com/u/Steve-Flores-51";

const Registry = () => {
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
        <a href={REGISTRY_URL} target="_blank" rel="noreferrer" className="mb-4 block overflow-hidden rounded-lg border">
          <img
            src={"https://www.myregistry.com/Images/Visitors/mr-share-image-Wedding.jpg"}
            alt={"Registry preview"}
            className="h-56 w-full object-cover sm:h-72"
          />
          <div className="p-3">
            <h2 className="font-semibold">Shop Ysabel and Steve</h2>
            <p className="mt-1 text-sm text-gray-600">Find the perfect gift - no app download needed!</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Registry;

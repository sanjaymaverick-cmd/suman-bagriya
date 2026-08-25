export default function IPhoneFrame({
  src,
  alt = "",
}: {
  src: string;
  alt?: string;
}) {
  return (
    <div className="iphone-frame">
      <span className="iphone-island" aria-hidden="true" />
      <img src={src} alt={alt} />
    </div>
  );
}

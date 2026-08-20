export default function PageGrid() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] hidden lg:block" aria-hidden="true">
      <div className="h-full px-[3.5%]">
        <div className="mx-auto h-full max-w-[1280px] border-x border-black/[0.07]">
          <div className="mx-auto grid h-full max-w-[920px] grid-cols-4">
            <div className="border-x border-black/[0.07]" />
            <div className="border-r border-black/[0.07]" />
            <div className="border-r border-black/[0.07]" />
            <div className="border-r border-black/[0.07]" />
          </div>
        </div>
      </div>
    </div>
  );
}

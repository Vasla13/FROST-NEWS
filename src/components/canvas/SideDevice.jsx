export default function SideDevice({ page, assets, styleObj }) {
  if (!page.showDevice) {
    return null;
  }

  return (
    <div className="absolute left-0 top-0 z-40 h-full overflow-hidden" style={{ width: `${page.sideDeviceWidth}%` }}>
      {assets.sideDevice ? (
        <img src={assets.sideDevice} alt="device" className="h-full w-full object-cover" />
      ) : (
        <div className="relative h-full w-full bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950">
          <div className="absolute left-1/2 top-4 h-10 w-10 -translate-x-1/2 rounded-full border border-slate-500 bg-black shadow-inner" />
          <div
            className="absolute left-1/2 top-20 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
            style={{ background: styleObj.cyan, boxShadow: `0 0 8px ${styleObj.cyan}` }}
          />
          <div
            className="absolute bottom-4 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full"
            style={{ background: styleObj.cyan, boxShadow: `0 0 18px ${styleObj.blueGlow}` }}
          />
        </div>
      )}
    </div>
  );
}

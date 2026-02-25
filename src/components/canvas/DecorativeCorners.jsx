export default function DecorativeCorners({
  assets,
  style,
  page,
  panelLeft = 0,
  bottomOffset,
  topInset = 0,
  bottomInset = 0,
}) {
  const useImages = page.showCorners;
  const panelLeftValue = `calc(${panelLeft}% + 0.05%)`;
  const panelBottomValue = typeof bottomOffset === "number" ? bottomOffset + bottomInset : (page.showTicker ? 7.2 : 2.2) + bottomInset;
  const panelBottom = `${panelBottomValue}%`;
  const topOffset = `${topInset + 2.6}%`;
  const cornerSize = "clamp(74px, 11cqw, 150px)";

  const fallbackCorner = (position, className, styleOverride = {}) => (
    <div
      className={`absolute ${className}`}
      style={{ width: cornerSize, height: cornerSize, color: style.cyan, opacity: 0.95, ...styleOverride }}
    >
      <svg viewBox="0 0 64 64" className="h-full w-full">
        <path
          d={
            position === "tl"
              ? "M2 62V22H22"
              : position === "tr"
                ? "M62 62V22H42"
                : position === "bl"
                  ? "M2 2V42H22"
                  : "M62 2V42H42"
          }
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path d="M8 54h10v-8h8v-8h8v-8h8" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.75" />
        <circle cx="14" cy="14" r="4" fill="currentColor" opacity="0.95" />
      </svg>
    </div>
  );

  return (
    <>
      {useImages &&
        (assets.cornerTL ? (
          <img
            src={assets.cornerTL}
            alt="corner tl"
            className="absolute z-20 object-contain"
            style={{ left: panelLeftValue, top: topOffset, width: cornerSize, height: cornerSize }}
          />
        ) : (
          fallbackCorner("tl", "z-20", { left: panelLeftValue, top: topOffset })
        ))}

      {useImages &&
        (assets.cornerTR ? (
          <img
            src={assets.cornerTR}
            alt="corner tr"
            className="absolute right-[0.2%] z-20 object-contain"
            style={{ top: topOffset, width: cornerSize, height: cornerSize }}
          />
        ) : (
          fallbackCorner("tr", "right-0 z-20 scale-x-[-1]", { top: topOffset })
        ))}

      {useImages &&
        (assets.cornerBL ? (
          <img
            src={assets.cornerBL}
            alt="corner bl"
            className="absolute z-20 object-contain"
            style={{ left: panelLeftValue, bottom: panelBottom, width: cornerSize, height: cornerSize }}
          />
        ) : (
          fallbackCorner("bl", "z-20 scale-y-[-1]", { left: panelLeftValue, bottom: panelBottom })
        ))}

      {useImages &&
        (assets.cornerBR ? (
          <img
            src={assets.cornerBR}
            alt="corner br"
            className="absolute right-[0.2%] z-20 object-contain"
            style={{ bottom: panelBottom, width: cornerSize, height: cornerSize }}
          />
        ) : (
          fallbackCorner("br", "right-0 z-20 scale-x-[-1] scale-y-[-1]", { bottom: panelBottom })
        ))}
    </>
  );
}

import AssetUploadButton from "../../ui/AssetUploadButton";
import useObjectUrlUpload from "../../../hooks/useObjectUrlUpload";
import { BUNDLED_PROJECT_ASSETS } from "../../../constants/project";

export default function AssetsTab({ setProjectAssets }) {
  const uploadOptions = {
    onError: (message) => alert(message),
  };
  const uploadSideDevice = useObjectUrlUpload((data) => setProjectAssets({ sideDevice: data }), uploadOptions);
  const uploadCornerTL = useObjectUrlUpload((data) => setProjectAssets({ cornerTL: data }), uploadOptions);
  const uploadCornerTR = useObjectUrlUpload((data) => setProjectAssets({ cornerTR: data }), uploadOptions);
  const uploadCornerBL = useObjectUrlUpload((data) => setProjectAssets({ cornerBL: data }), uploadOptions);
  const uploadCornerBR = useObjectUrlUpload((data) => setProjectAssets({ cornerBR: data }), uploadOptions);
  const uploadMetaStrip = useObjectUrlUpload((data) => setProjectAssets({ metaStrip: data }), uploadOptions);
  const uploadLogoStamp = useObjectUrlUpload((data) => setProjectAssets({ logoStamp: data }), uploadOptions);

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-3">
        <div className="text-xs font-bold tracking-wide text-cyan-100/90">Assets globaux (references style)</div>
        <p className="text-xs text-cyan-100/50">
          Upload tes elements graphiques (device, corners, separateurs, logos). Ils seront reutilisables sur toutes les pages.
        </p>
        <button
          onClick={() => setProjectAssets({ ...BUNDLED_PROJECT_ASSETS })}
          className="w-full rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100 hover:border-cyan-300/50"
        >
          Charger automatiquement les assets du dossier `assets`
        </button>

        <AssetUploadButton label="Device lateral" onUpload={uploadSideDevice} onClear={() => setProjectAssets({ sideDevice: "" })} />
        <AssetUploadButton label="Corner TL" onUpload={uploadCornerTL} onClear={() => setProjectAssets({ cornerTL: "" })} />
        <AssetUploadButton label="Corner TR" onUpload={uploadCornerTR} onClear={() => setProjectAssets({ cornerTR: "" })} />
        <AssetUploadButton label="Corner BL" onUpload={uploadCornerBL} onClear={() => setProjectAssets({ cornerBL: "" })} />
        <AssetUploadButton label="Corner BR" onUpload={uploadCornerBR} onClear={() => setProjectAssets({ cornerBR: "" })} />
        <AssetUploadButton label="Bande meta (optionnel)" onUpload={uploadMetaStrip} onClear={() => setProjectAssets({ metaStrip: "" })} />
        <AssetUploadButton label="Logo stamp (optionnel)" onUpload={uploadLogoStamp} onClear={() => setProjectAssets({ logoStamp: "" })} />
      </div>
    </div>
  );
}

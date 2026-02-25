import Field from "../../ui/Field";
import Input from "../../ui/Input";

const STYLE_COLOR_FIELDS = [
  ["cyan", "Cyan principal"],
  ["cyanSoft", "Cyan clair"],
  ["blueGlow", "Glow bleu"],
  ["dark", "Fond dark"],
  ["panel", "Panel"],
];

export default function StyleTab({ project, setProjectStyle }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-3">
        <div className="text-xs font-bold tracking-wide text-cyan-100/90">Palette globale</div>
        {STYLE_COLOR_FIELDS.map(([key, label]) => (
          <Field key={key} label={label}>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={project.style[key]}
                onChange={(event) => setProjectStyle({ [key]: event.target.value })}
                className="h-10 w-14 rounded-xl border border-cyan-400/20 bg-transparent p-1"
              />
              <Input value={project.style[key]} onChange={(event) => setProjectStyle({ [key]: event.target.value })} />
            </div>
          </Field>
        ))}
      </div>
    </div>
  );
}

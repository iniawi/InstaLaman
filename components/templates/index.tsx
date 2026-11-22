import type { TemplateKey } from "@/lib/templates";
import type { TplProps } from "./shared";
import Basic from "./Basic";
import Kuliner from "./Kuliner";
import Kue from "./Kue";
import Organik from "./Organik";
import Fashion from "./Fashion";
import Kriya from "./Kriya";
import Kecantikan from "./Kecantikan";
import Jasa from "./Jasa";

const MAP: Record<TemplateKey, (p: TplProps) => JSX.Element> = {
  basic: Basic, kuliner: Kuliner, kue: Kue, organik: Organik,
  fashion: Fashion, kriya: Kriya, kecantikan: Kecantikan, jasa: Jasa,
};

export function renderTemplate(key: TemplateKey, props: TplProps) {
  const C = MAP[key] ?? Basic;
  return (
    <div className="tpl">
      <C {...props} />
    </div>
  );
}

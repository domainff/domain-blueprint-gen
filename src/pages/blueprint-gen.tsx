import { useEffect, useState } from "react";
import { buildAlgorithmConfig } from "@/lib/build-config";
import type { AlgorithmConfig } from "@/lib/types";

const q = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
const leagueId = q.get("leagueId") || "";
const teamId = Number(q.get("teamId") || 1);
const week = Number(q.get("week") || 1);

export default function Page() {
  const [cfg, setCfg] = useState<AlgorithmConfig | null>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!leagueId || !teamId) return;
      const c = await buildAlgorithmConfig(leagueId, teamId, week);
      setCfg(c);
    })();
  }, []);

  const update = (delta: Partial<AlgorithmConfig>) =>
    setCfg(prev => prev ? deepMerge(prev, delta) : prev);

  const exportPng = async () => {
    if (!cfg) return;
    const resp = await fetch("/api/render-blueprint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cfg),
    });
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    setPngUrl(url);
  };

  if (!cfg) return <div style={{padding:20}}>Loading… (add ?leagueId=…&teamId=…&week=… to the URL)</div>;

  return (
    <div style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:16,padding:16}}>
      <div style={{display:"grid",gap:12}}>
        <h3>Blueprint Editor</h3>
        <label>Team Name
          <input value={cfg.meta.teamName} onChange={e=>update({ meta:{...cfg.meta, teamName:e.target.value} })}/>
        </label>
        <label>Record
          <input value={cfg.meta.record} onChange={e=>update({ meta:{...cfg.meta, record:e.target.value} })}/>
        </label>
        <label>Weekly Strategy
          <input value={cfg.meta.weeklyStrategy} onChange={e=>update({ meta:{...cfg.meta, weeklyStrategy:e.target.value} })}/>
        </label>
        <button onClick={exportPng}>Export PNG</button>
      </div>

      <div>
        <div style={{opacity:.7, marginBottom:8}}>After “Export PNG”, your image shows here:</div>
        {pngUrl ? <img src={pngUrl} style={{width:960, height:"auto", border:"1px solid #333"}}/> : <div>—</div>}
        <details style={{marginTop:12}}>
          <summary>Debug JSON</summary>
          <pre style={{maxHeight:300, overflow:"auto"}}>{JSON.stringify(cfg,null,2)}</pre>
        </details>
      </div>
    </div>
  );
}

function isObj(o:any){ return o && typeof o==="object" && !Array.isArray(o); }
function deepMerge<T>(a:T,b:any):T{
  if(!isObj(b)) return (b ?? a) as T;
  const out:any = Array.isArray(a)?[...(a as any)]:{...(a as any)};
  for(const k of Object.keys(b)){
    const v=(b as any)[k];
    if(isObj(v) && isObj(out[k])) out[k]=deepMerge(out[k],v);
    else out[k]=v;
  }
  return out;
}

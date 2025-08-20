import React from "react";
import type { AlgorithmConfig } from "@/lib/types";

const C = { bg:"#0B0D10", panel:"#14181E", text:"#EDEFF2", sub:"#B8C0CC", divider:"#2B3340", good:"#2BD46C" };

export default function Blueprint({ cfg }: { cfg: AlgorithmConfig }) {
  return (
    <div style={{
      width:1920, height:1080, background:C.bg, color:C.text, padding:24,
      display:"grid", gridTemplateColumns:"1.4fr 1fr 0.8fr", gap:16, fontFamily:"Inter, system-ui, sans-serif"
    }}>
      {/* Header */}
      <div style={{gridColumn:"1 / -1", background:C.panel, borderRadius:12, padding:16, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{fontSize:34, fontWeight:700}}>DFF {cfg.meta.teamName}</div>
        <div style={{display:"flex", gap:8, alignItems:"center"}}>
          <div style={{fontWeight:700, fontSize:12, color:C.sub}}>{cfg.meta.weekLabel}</div>
          <div style={{fontWeight:700, fontSize:12, background:"#202733", padding:"4px 8px", borderRadius:8}}>
            {cfg.settings.teams}-TEAM • {cfg.settings.scoring}
          </div>
          <div style={{fontWeight:700, fontSize:12, background:C.good, color:"#0B0D10", padding:"4px 8px", borderRadius:8}}>
            {cfg.meta.outlook}
          </div>
        </div>
      </div>

      {/* Left column: lineup */}
      <div style={{display:"grid", gap:12}}>
        <div style={{background:C.panel, borderRadius:12, padding:16}}>
          <div style={{fontWeight:700, fontSize:20}}>RECOMMENDED LINEUP</div>
          <div style={{marginTop:8}}>
            {cfg.lineup.map((s,i)=>(
              <div key={i} style={{display:"flex", alignItems:"center", padding:"10px 0", borderTop: i?`1px solid ${C.divider}`:"none"}}>
                <div style={{width:48,height:48,borderRadius:8,overflow:"hidden",background:"#223", flexShrink:0}}>
                  {s.player.headshotUrl ? <img src={s.player.headshotUrl} width={48} height={48} /> : null}
                </div>
                <div style={{marginLeft:10, flex:1, minWidth:0}}>
                  <div style={{fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{s.player.name}</div>
                  <div style={{fontSize:12, color:C.sub}}>{s.player.pos} • {s.player.team}</div>
                </div>
                <div style={{fontSize:12, color:C.sub}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle: factors + market */}
      <div style={{display:"grid", gap:12}}>
        <div style={{background:C.panel, borderRadius:12, padding:16}}>
          <div style={{fontWeight:700, fontSize:20}}>FOUR FACTORS</div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:8}}>
            {cfg.fourFactors.map((f,i)=>(
              <div key={i} style={{background:"#10151C", borderRadius:10, padding:12}}>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <div style={{fontWeight:700, fontSize:12, color:C.sub}}>{f.kind.toUpperCase()}</div>
                  <div style={{fontWeight:700}}>{f.score}/10</div>
                </div>
                <ul style={{margin:8, marginTop:4, paddingLeft:18, color:C.sub, fontSize:12}}>
                  {(f.bullets || []).map((b,k)=><li key={k}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:C.panel, borderRadius:12, padding:16}}>
          <div style={{fontWeight:700, fontSize:20}}>MARKET PLAYS</div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:8}}>
            {cfg.market.map((sec,i)=>(
              <div key={i} style={{background:"#10151C", borderRadius:10, padding:12}}>
                <div style={{fontSize:12, color:C.sub, fontWeight:700}}>{sec.title.toUpperCase()}</div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:6}}>
                  {sec.items.map((it,k)=>(
                    <div key={k} style={{background:"#19212B", borderRadius:8, padding:8}}>
                      <div style={{fontWeight:700, fontSize:12, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{it.title}</div>
                      <div style={{fontSize:11, color:C.sub}}>{it.subtitle}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column: record/strategy */}
      <div style={{display:"grid", gap:12}}>
        <div style={{background:C.panel, borderRadius:12, padding:16}}>
          <div style={{fontSize:12, color:C.sub, fontWeight:700}}>TEAM RECORD</div>
          <div style={{fontSize:28, fontWeight:700}}>{cfg.meta.record}</div>
        </div>
        <div style={{background:C.panel, borderRadius:12, padding:16}}>
          <div style={{fontSize:12, color:C.sub, fontWeight:700}}>WEEKLY STRATEGY</div>
          <div style={{fontSize:24, fontWeight:700}}>{cfg.meta.weeklyStrategy}</div>
          {cfg.notes ? <div style={{marginTop:8, fontSize:12, color:C.sub}}>{cfg.notes}</div> : null}
        </div>
      </div>
    </div>
  );
}

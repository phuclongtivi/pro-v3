"use client";
import {useEventSpace} from "@/components/EventSpaceProvider";
export default function EvolutionBadge(){const{generation,score}=useEventSpace();return <div className="evolutionBadge" title="EventSpace Evolution Benchmark"><span>EVENTSPACE</span><b>{generation}</b><small>KQ {score.results} • TH {score.evolution} • KT {score.economy}</small></div>}

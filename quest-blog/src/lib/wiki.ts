import data from "@/data/llm-wiki.json";

export const wiki = data;
export type WikiNode = (typeof data.nodes)[number];
export type WikiEdge = (typeof data.edges)[number];
export const noteColors: Record<string, string> = {
  concept: "#c1e591",
  map: "#edc87f",
  comparison: "#c6a9ee",
  interview: "#8dc5e9",
};
export const noteTypes: Record<string, string> = {
  concept: "Concept",
  map: "Map",
  comparison: "Comparison",
  interview: "Interview",
};
export const relationNames: Record<string, string> = {
  prerequisites: "Prerequisites",
  part_of: "Part of",
  enables: "Enables",
  used_by: "Used by",
  contrasts_with: "Contrasts with",
  affects: "Affects",
  optimized_by: "Optimized by",
  implemented_in: "Implemented in",
};
export function relatedNotes(id: string) {
  return data.edges.filter((e) => e.source === id || e.target === id);
}

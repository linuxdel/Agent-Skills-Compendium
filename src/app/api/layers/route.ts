import { repository } from "@/lib/content-store";
import { apiJson } from "@/lib/api";

/** GET /api/layers — the five architectural layers with live skill counts. */
export async function GET() {
  const [layers, skills] = await Promise.all([repository.listLayers(), repository.listSkills()]);
  return apiJson({
    count: layers.length,
    layers: layers.map((layer) => ({
      ...layer,
      skill_count: skills.filter((s) => s.layer === layer.id).length,
      href: `/layers/${layer.slug}`,
    })),
  });
}

import type { NextRequest } from "next/server";
import { repository } from "@/lib/content-store";
import { applyFilters, filtersFromParams } from "@/lib/search";
import { apiJson } from "@/lib/api";

/** GET /api/skills — the full registry, filterable with the same params as /skills. */
export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const filters = filtersFromParams(params);
  const skills = await repository.listSkills();
  const results = applyFilters(skills, filters);

  const summary = request.nextUrl.searchParams.get("view") !== "full";
  return apiJson({
    count: results.length,
    total: skills.length,
    filters,
    skills: summary
      ? results.map((s) => ({
          id: s.id,
          slug: s.slug,
          name: s.name,
          version: s.version,
          category: s.category,
          layer: s.layer,
          domain: s.domain,
          description: s.description,
          complexity: s.complexity,
          maturity: s.maturity,
          build_speed: s.build_speed,
          shareability: s.shareability,
          risk_level: s.risk_level,
          tags: s.tags,
          href: `/skills/${s.slug}`,
        }))
      : results,
  });
}

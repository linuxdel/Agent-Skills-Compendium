import { repository } from "@/lib/content-store";
import { dependents, relatedGroups } from "@/lib/relations";
import { apiError, apiJson } from "@/lib/api";

/** GET /api/skills/:slug/related — the skill's edges, resolved. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [skill, all] = await Promise.all([repository.getSkill(slug), repository.listSkills()]);
  if (!skill) return apiError(`No skill with slug "${slug}"`, 404);

  const summarise = (s: { slug: string; name: string; layer: string; category: string }) => ({
    slug: s.slug,
    name: s.name,
    layer: s.layer,
    category: s.category,
    href: `/skills/${s.slug}`,
  });

  return apiJson({
    slug: skill.slug,
    groups: relatedGroups(skill, all).map((group) => ({
      relation: group.relation,
      skills: group.skills.map(summarise),
    })),
    depended_on_by: dependents(skill, all).map(summarise),
  });
}

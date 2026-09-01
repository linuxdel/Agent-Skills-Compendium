import { repository } from "@/lib/content-store";
import { apiJson } from "@/lib/api";

/** GET /api/categories — the taxonomy with live skill counts. */
export async function GET() {
  const [categories, skills] = await Promise.all([
    repository.listCategories(),
    repository.listSkills(),
  ]);
  return apiJson({
    count: categories.length,
    categories: categories.map((category) => ({
      ...category,
      skill_count: skills.filter((s) => s.category === category.slug).length,
      href: `/categories/${category.slug}`,
    })),
  });
}

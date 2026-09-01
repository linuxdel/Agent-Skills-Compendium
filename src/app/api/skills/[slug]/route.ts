import { repository } from "@/lib/content-store";
import { apiError, apiJson } from "@/lib/api";

/** GET /api/skills/:slug — one complete skill definition. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = await repository.getSkill(slug);
  if (!skill) return apiError(`No skill with slug "${slug}"`, 404);
  return apiJson({ skill });
}

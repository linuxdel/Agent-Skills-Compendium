import type { NextRequest } from "next/server";
import { repository } from "@/lib/content-store";
import { toJson, toYaml } from "@/lib/export";
import { apiError, apiText } from "@/lib/api";

/** GET /api/skills/:slug/export?format=yaml|json — the portable definition. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const skill = await repository.getSkill(slug);
  if (!skill) return apiError(`No skill with slug "${slug}"`, 404);

  const format = request.nextUrl.searchParams.get("format") ?? "yaml";
  if (format !== "yaml" && format !== "json") {
    return apiError(`Unsupported format "${format}". Use yaml or json.`, 400);
  }
  const download = request.nextUrl.searchParams.get("download") === "1";
  const filename = download ? `${skill.slug}.${format}` : undefined;

  return format === "yaml"
    ? apiText(toYaml(skill), "text/yaml", filename)
    : apiText(toJson(skill), "application/json", filename);
}

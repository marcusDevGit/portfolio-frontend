import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase URL ou Publishable Key não estão configurados");
}

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const PORTFOLIO_PUBLIC_MARKER = "/storage/v1/object/public/portfolio/";

/**
 * Remove arquivos do bucket público `portfolio` no Supabase Storage a partir de suas URLs.
 * Falhas de permissão ou URLs externas são registradas apenas como aviso para não bloquear o CMS.
 */
export async function removeStorageFilesByUrls(
  urls: (string | null | undefined)[],
): Promise<void> {
  if (!supabase) return;

  const paths = Array.from(
    new Set(
      urls
        .filter((u): u is string => Boolean(u))
        .map((url) => {
          const idx = url.indexOf(PORTFOLIO_PUBLIC_MARKER);
          if (idx === -1) return null;
          const rawPath = url
            .slice(idx + PORTFOLIO_PUBLIC_MARKER.length)
            .split("?")[0];
          return rawPath ? decodeURIComponent(rawPath) : null;
        })
        .filter((p): p is string => Boolean(p)),
    ),
  );

  if (paths.length === 0) return;

  try {
    const { error } = await supabase.storage.from("portfolio").remove(paths);
    if (error) {
      console.warn("[SupabaseStorage] Falha ao remover arquivos órfãos:", error.message);
    }
  } catch (err) {
    console.warn("[SupabaseStorage] Erro ao remover arquivos órfãos:", err);
  }
}

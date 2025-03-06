import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TallerDetalle from "../components/taller-detalle";
import type { Taller } from "@/types/types";

export default async function TallerDetalleConReferido({
  params,
}: {
  params: { id: string; referidoPor: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  // Obtener datos del taller
  const { data: taller } = await supabase
    .from("talleres")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!taller) {
    redirect("/talleres");
  }

  // Guardar la información del referido en la sesión o cookies para usarla durante el registro
  if (params.referidoPor) {
    cookies().set("referidoPor", params.referidoPor, {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 día
    });
  }

  return <TallerDetalle taller={taller as unknown as Taller} referidoPor={params.referidoPor} />;
}

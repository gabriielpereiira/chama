import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Variáveis de ambiente ausentes (NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY)" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Supabase respondeu status ${res.status}` },
        { status: res.status }
      );
    }

    const spec = await res.json();
    const tables = Object.keys(spec?.paths ?? {}).filter(
      (p) => !p.includes("/rpc/")
    );

    return NextResponse.json({ tables });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

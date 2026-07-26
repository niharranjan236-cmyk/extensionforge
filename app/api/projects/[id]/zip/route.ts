import JSZip from "jszip";
import { NextResponse } from "next/server";
import type { ProjectFiles } from "@/lib/supabase";

export async function POST(request: Request) {
  const { name, files } = await request.json() as { name?: string; files?: ProjectFiles };
  if (!files || !Object.keys(files).length) return NextResponse.json({ error: "Project files are required." }, { status: 400 });
  const zip = new JSZip();
  Object.entries(files).forEach(([path, content]) => zip.file(path, content));
  const buffer = await zip.generateAsync({ type: "uint8array" });
  const filename = `${(name || "extension").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.zip`;
  return new Response(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer, { headers: { "Content-Type": "application/zip", "Content-Disposition": `attachment; filename="${filename}"` } });
}

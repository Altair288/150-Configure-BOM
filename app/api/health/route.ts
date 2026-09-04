export const dynamic = "force-static";

export function GET() {
  return Response.json({
    status: "ok",
    service: "super-bom-configurator",
    timestamp: new Date().toISOString(),
  });
}
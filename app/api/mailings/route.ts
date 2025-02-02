const mailings: any[] = [];

export async function GET() {
  return new Response(JSON.stringify(mailings), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const data = await req.json();
  mailings.push({ id: Date.now(), ...data });

  return new Response(JSON.stringify({ message: "Mailing Scheduled", data }), {
    headers: { "Content-Type": "application/json" },
  });
}

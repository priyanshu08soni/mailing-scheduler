export async function GET() {
    const mailers = [
      { id: "1", name: "Promo Email" },
      { id: "2", name: "Newsletter" },
    ];
    return new Response(JSON.stringify(mailers), {
        headers: { "Content-Type": "application/json" },
    });
}
  
export async function GET() {
    const lists = [
      { id: "101", name: "Customers" },
      { id: "102", name: "Subscribers" },
    ];
  
    return new Response(JSON.stringify(lists), {
      headers: { "Content-Type": "application/json" },
    });
  }
  
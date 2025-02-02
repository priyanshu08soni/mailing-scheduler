export const fetchMailers = async () => {
  const res = await fetch("/api/mailers");
  return res.json();
};

export const fetchLists = async () => {
  const res = await fetch("/api/lists");
  return res.json();
};

export const createMailing = async (data: any) => {
  const res = await fetch("/api/mailings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

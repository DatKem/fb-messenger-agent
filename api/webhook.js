export default async function handler(req, res) {
  const VERIFY_TOKEN = "kelly_agent_123"; // bạn sẽ dùng token này trong Facebook

  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  if (req.method === "POST") {
    const body = req.body;
    console.log("📩 Tin nhắn nhận được:", JSON.stringify(body, null, 2));
    return res.status(200).send("EVENT_RECEIVED");
  }

  return res.sendStatus(404);
}
add webhook file

export default function handler(req, res) {
  const VERIFY_TOKEN = "kelly_agent_123";

  if (req.method === "GET") {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const mode = params.get("hub.mode");
    const token = params.get("hub.verify_token");
    const challenge = params.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  if (req.method === "POST") {
    console.log("📩 Tin nhắn nhận được:", JSON.stringify(req.body, null, 2));
    return res.status(200).send("EVENT_RECEIVED");
  }

  return res.sendStatus(404);
}

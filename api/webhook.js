export default async function handler(req, res) {
  const VERIFY_TOKEN = "kelly_agent_123";

  if (req.method === "GET") {
    try {
      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
      } else {
        return res.sendStatus(403);
      }
    } catch (error) {
      console.error("Error in GET:", error);
      return res.sendStatus(500);
    }
  }

  if (req.method === "POST") {
    try {
      console.log("📩 Tin nhắn nhận được:", JSON.stringify(req.body, null, 2));
      return res.status(200).send("EVENT_RECEIVED");
    } catch (error) {
      console.error("Error in POST:", error);
      return res.sendStatus(500);
    }
  }

  return res.sendStatus(404);
}

import axios from 'axios';

export default async function handler(req, res) {
  const VERIFY_TOKEN = "kelly_agent_123"; // token xác minh webhook
  const PAGE_ACCESS_TOKEN = "EAARRumy3XLoBO4DPPIMthxeaX6lZB6jhDxAqahjRAK1Xz4tGwlZApRXspYyeSSQekhmkw04hAQ0sIwFbsNZC4XFv82K6mBPE14WmDLmEvPxzM1B1dY8sf4k3L4Mxf3Pq6MyNFZC6FYwyRdJ1CjfpEci59wtU9WrCOmm3CL9rsrjlo3ATh2GM5NILT0EhTQBYBPf5MgRxeZB8yj5zonWE4O6slqUMZD" // <-- thay bằng Page Access Token của bạn

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
      const body = req.body;
      console.log("📩 Tin nhắn nhận được:", JSON.stringify(body, null, 2));

      if (body.object === "page") {
        for (const entry of body.entry) {
          for (const messagingEvent of entry.messaging) {
            const senderId = messagingEvent.sender.id;

            if (messagingEvent.message && messagingEvent.message.text) {
              const receivedMessage = messagingEvent.message.text;

              // 👉 Tạo nội dung trả lời
              let replyText = `Dạ shop đã nhận được tin nhắn: "${receivedMessage}". Shop sẽ phản hồi chị ngay nhé!`;

              // 👉 Gửi tin nhắn trả lời
              await axios.post(`https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
                recipient: { id: senderId },
                message: { text: replyText }
              });

              console.log("✅ Đã gửi tin nhắn trả lời");
            }
          }
        }
      }

      return res.status(200).send("EVENT_RECEIVED");
    } catch (error) {
      console.error("Error in POST:", error.response ? error.response.data : error.message);
      return res.sendStatus(500);
    }
  }

  return res.sendStatus(404);
}

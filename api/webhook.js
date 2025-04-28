export default async function handler(req, res) {
  const VERIFY_TOKEN = "kelly_agent_123"; // token xác minh webhook
  const PAGE_ACCESS_TOKEN = "EAARRumy3XLoBO99pB1efZCRBrXJYVlGHGnPMFbt2whfznkcovXBYhltZAxaftZCAvaQG0nMh5ZBlsgDGjTMJ9G1TL6E7A0J3QfuLvzdUR1aqnZC6puT9hP5v5xFgdZCjgydmsZACVl1yDJ2ZBuSoNHdYlFfufw2zYZCfl1u6BInZB8e4VXhdKibKkHQVTundrEs3vPaD20wH3jJAZCEmr3i0kQHqnqZBayQZD"; // ⚡ bạn thay token của trang Facebook tại đây nhé

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
      
      if (body.object === "page") {
        for (const entry of body.entry) {
          for (const messagingEvent of entry.messaging) {
            if (messagingEvent.message && messagingEvent.sender) {
              const senderId = messagingEvent.sender.id;
              const messageText = messagingEvent.message.text || "";

              let replyText = "Dạ shop chưa rõ ý chị, chị có thể nhắn lại giúp shop được không ạ?";

              // Logic nhận dạng từ khoá
              if (messageText.toLowerCase().includes("size")) {
                replyText = "Dạ chị muốn hỏi về size đúng không ạ? Shop hiện có size S, M, L nhé.";
              } else if (messageText.toLowerCase().includes("giá")) {
                replyText = "Dạ sản phẩm bên shop dao động từ 500k - 1 triệu ạ.";
              } else if (messageText.toLowerCase().includes("ship") || messageText.toLowerCase().includes("vận chuyển")) {
                replyText = "Dạ bên shop ship toàn quốc, thời gian nhận hàng từ 2-5 ngày nha chị.";
              } else if (messageText.toLowerCase().includes("còn hàng") || messageText.toLowerCase().includes("tồn kho")) {
                replyText = "Dạ sản phẩm shop còn hàng đó chị. Shop kiểm tra và báo ngay cho chị nhé!";
              }

              // Gửi tin nhắn trả lời về Facebook Messenger
              await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  recipient: { id: senderId },
                  message: { text: replyText },
                }),
              });
            }
          }
        }
      }

      return res.status(200).send("EVENT_RECEIVED");
    } catch (error) {
      console.error("Error in POST:", error);
      return res.sendStatus(500);
    }
  }

  return res.sendStatus(404);
}

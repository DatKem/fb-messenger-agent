import axios from 'axios';

export default async function handler(req, res) {
  const VERIFY_TOKEN = "kelly_agent_123"; 
  const PAGE_ACCESS_TOKEN = "EAARRumy3XLoBO59uNZAFchNKi4WRZBcIyuHvJ06BC5MExOW1eqcIae7xWnZBCz1avbp1oqcPmpgMZA9FJqcESDs21erspwKFsUMDy0VUVj3co8JKT9geeR8ZCopD9FdyF5sfXjkXWkEiNStgZCsVoPWkRwTkMs2ZAZCiFsypzEbSAZCqOXQNeHkMjHmhZAAK3ZA5taEqLs3iwjqeRdhqqrjigLESEEn79oZD"; // 👉 THAY bằng đúng Page Access Token

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
    try {
      const body = req.body;

      if (body.object === "page") {
        for (const entry of body.entry) {
          for (const event of entry.messaging) {
            const senderId = event.sender?.id;
            const messageText = event.message?.text;

            if (senderId && messageText) {
              let replyText = `Dạ shop đã nhận được tin nhắn: "${messageText}". Shop sẽ phản hồi chị ngay nhé!`;

              try {
                await axios.post(`https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
                  recipient: { id: senderId },
                  message: { text: replyText }
                });
                console.log("✅ Đã gửi tin nhắn phản hồi thành công");
              } catch (err) {
                console.error("❌ Lỗi khi gửi tin nhắn:", err.response?.data || err.message);
              }
            } else {
              console.log("⚠️ Không phải tin nhắn văn bản hoặc thiếu senderId.");
            }
          }
        }
      }

      return res.status(200).send("EVENT_RECEIVED");
    } catch (error) {
      console.error("❌ Lỗi xử lý webhook POST:", error);
      return res.sendStatus(500);
    }
  }

  return res.sendStatus(404);
}

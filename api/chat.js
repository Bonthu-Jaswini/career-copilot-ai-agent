export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message found" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "You are Career Copilot AI. Give career guidance answers."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("Groq response:", data);

    return res.status(200).json({
      reply: data?.choices?.[0]?.message?.content || "No AI response"
    });

  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ error: "AI backend failed" });
  }
}

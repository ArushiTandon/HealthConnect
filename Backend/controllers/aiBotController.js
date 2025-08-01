const axios = require("axios");
const Hospital = require("../models/Hospital");

exports.askBot = async (req, res) => {
  const { question } = req.body;

  try {
    const hospitals = await Hospital.find({});

    const hospitalData = hospitals
      .map((h) => {
        return `
            Name: ${h.name}
            City: ${h.city}
            Address: ${h.address}
            Contact: ${h.contactNumber}
            Total Beds: ${h.totalBeds}
            Available Beds: ${h.availableBeds}
            ICU Beds: ${h.icuBeds}
            Emergency Beds: ${h.emergencyBeds}
            Facilities: ${h.facilities.join(", ")}
            Specialties: ${h.medicalSpecialties.join(", ")}
            Rating: ${h.rating}
                `.trim();
                })
                .join("\n\n");

    const messages = [
      {
        role: "system",
        content: `You are a helpful hospital assistant chatbot. Based on the hospital data provided below, answer the user's questions accurately and only from this data:\n\n${hospitalData}`,
      },
      {
        role: "user",
        content: question,
      },
    ];

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free",
        messages,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://healthconnect-frontend.onrender.com",
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ answer: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: "Bot failed to respond." });
  }
};

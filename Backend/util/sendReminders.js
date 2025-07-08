const Appointment = require("../models/Appointment");
const sendEmail = require("../services/sendGrid");

const sendReminders = async () => {
  const now = new Date();

  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in25Hours = new Date(now.getTime() + 25 * 60 * 60 * 1000);

  const appointments = await Appointment.find({
    date: {
      $gte: in24Hours,
      $lte: in25Hours,
    },
    isReminderSent: false,
    status: "Confirmed", 
  })
    .populate("userId")
    .populate("hospitalId");

  for (const appt of appointments) {
    const user = appt.userId;
    const hospital = appt.hospitalId;

    const appointmentTime = appt.time;
    const appointmentDate = appt.date.toDateString();

    const message = `Hi ${user.name}, this is a reminder for your appointment at ${hospital.name} scheduled at ${appointmentTime} on ${appointmentDate}. Please arrive on time.`;

    await sendEmail({
      to: user.email,
      subject: `📅 Reminder: Appointment at ${hospital.name} Tomorrow`,
      text: message,
      html: `<p>${message}</p>`,
    });

    appt.isReminderSent = true;
    await appt.save();
  }

  console.log(`${appointments.length} reminders sent for tomorrow's appointments`);
};

module.exports = sendReminders;

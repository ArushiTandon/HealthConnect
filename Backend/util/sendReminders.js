const Appointment = require("../models/Appointment");
const sendEmail = require("../services/brevoEmail");

const sendReminders = async () => {
  try {

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

    try {
        await sendEmail({
          to: user.email,
          subject: `📅 Reminder: Appointment at ${hospital.name} Tomorrow`,
          text: message,
          html: `<p>Hi <strong>${user.name}</strong>,</p>
                 <p>This is a reminder for your upcoming appointment at <strong>${hospital.name}</strong>.</p>
                 <hr/>
                 <p>📅 <strong>Date:</strong> ${appointmentDate}</p>
                 <p>⏰ <strong>Time:</strong> ${appointmentTime}</p>
                 <hr/>
                 <p>Please arrive on time. If you need to cancel or reschedule, please use the dashboard.</p>`,
        });
        
        appt.isReminderSent = true;
        await appt.save();
        console.log(`Email successfully sent to ${user.email}`);
      } catch (emailError) {
        console.error(`Failed to send email for appointment ${appt._id}:`, emailError);
      }
    }
    
    console.log(`${appointments.length} reminders sent for tomorrow's appointments`);
  }
  catch(error){
    console.error("Critical error inside sendReminders cron job:", error);
  }
};

module.exports = sendReminders;

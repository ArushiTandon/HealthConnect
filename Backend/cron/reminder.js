const cron = require("node-cron");
const sendDueReminders = require("../util/sendReminders");

cron.schedule("*0 9 * * *", async () => {
  await sendDueReminders();
});

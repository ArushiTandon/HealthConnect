const Appointment = require('../models/Appointment');


exports.createAppointment = async (req, res) => {

    const userId = req.user.id;

    try {
        const { hospitalId, date, time, reason } = req.body; 
        if (!hospitalId || !date) {
            return res.status(400).json({ message: "Hospital ID and date are required" });
        }

        const newAppointment = new Appointment({
            userId: userId,
            hospitalId: hospitalId,
            date: new Date(date),
            time: time,
            reason: reason,
            status: "Pending"
        });

        await newAppointment.save();
        res.status(201).json({
            message: "Appointment created successfully",
            Appointment: newAppointment
        });
        
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

exports.getUserAppointments = async (req, res) => {
    const userId = req.user.id;

    try {
        const appointments = await Appointment.find({ userId: userId });
        res.status(200).json(appointments);
        
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

exports.cancelAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    const status = "Cancelled";

    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status: status},
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({
            message: "Appointment cancelled successfully",
            appointment: updatedAppointment
        });
        
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

// For hospital admin
exports.getHospitalAppointments = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;

    const appointments = await Appointment.find({ hospitalId })
      .populate("userId", "username email")
      .sort({ date: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    if (String(appointment.hospitalId) !== String(req.user.hospitalId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({ message: 'Status updated', appointment });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


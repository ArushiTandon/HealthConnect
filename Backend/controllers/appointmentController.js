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

       
        const io = req.app.get('io');
        const emitToHospital = req.app.get('emitToHospital');
        
        if (emitToHospital) {
            emitToHospital(hospitalId, 'newAppointment', {
                appointment: newAppointment,
                message: 'New appointment request received'
            });
        }

        res.status(201).json({
            message: "Appointment created successfully",
            appointment: newAppointment
        });
        
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.getUserAppointments = async (req, res) => {
    const userId = req.user.id;

    try {
        const appointments = await Appointment.find({ userId: userId })
            .populate('hospitalId', 'name address contactNumber')
            .sort({ date: -1 });
        
        res.status(200).json(appointments);
        
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.cancelAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    const userId = req.user.id;

    try {
        const appointment = await Appointment.findById(appointmentId);
        
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status: "Cancelled" },
            { new: true }
        ).populate('hospitalId', 'name address contactNumber');

      
        const emitToHospital = req.app.get('emitToHospital');
        
        if (emitToHospital) {
            emitToHospital(appointment.hospitalId, 'appointmentCancelled', {
                appointment: updatedAppointment,
                message: 'Appointment cancelled by patient'
            });
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
        console.error("Error fetching hospital appointments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (String(appointment.hospitalId) !== String(req.user.hospitalId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        appointment.status = status;
        await appointment.save();

        const populatedAppointment = await Appointment.findById(id)
            .populate('userId', 'username email')
            .populate('hospitalId', 'name address contactNumber');

        const emitToUser = req.app.get('emitToUser');
        
        if (emitToUser) {
            emitToUser(appointment.userId, 'appointmentStatusUpdated', {
                appointment: populatedAppointment,
                message: `Appointment ${status.toLowerCase()}`,
                status: status
            });
        }

        res.status(200).json({ 
            message: 'Appointment status updated successfully', 
            appointment: populatedAppointment 
        });
        
    } catch (error) {
        console.error("Error updating appointment status:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Admin function to get all appointments for dashboard
exports.getAllAppointments = async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId;
        
        const appointments = await Appointment.find({ hospitalId })
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });

        
        const stats = {
            total: appointments.length,
            pending: appointments.filter(app => app.status === 'Pending').length,
            confirmed: appointments.filter(app => app.status === 'Confirmed').length,
            cancelled: appointments.filter(app => app.status === 'Cancelled').length,
            completed: appointments.filter(app => app.status === 'Completed').length
        };

        res.status(200).json({
            appointments,
            stats
        });
        
    } catch (error) {
        console.error("Error fetching all appointments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
import Report from "../../../models/schema/Report.js";
import Student from "../../../models/schema/Student.js";


// Add a new report
export const addReport = async (req, res) => {
  try {
    const { studentId, type, message } = req.body; 

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Create and save the new report
    const newReport = new Report({
      student: studentId,
      type,
      message,
    });

    const savedReport = await newReport.save();
    res.status(201).json({ message: 'Report added successfully', report: savedReport });
  } catch (error) {
    res.status(500).json({ message: 'Error adding report', error: error.message });
  }
};


// Delete a report
export const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    // Find and delete the report
    const deletedReport = await Report.findByIdAndDelete(reportId);
    if (!deletedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting report', error: error.message });
  }
};

// Edit a report
export const editReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { type, message } = req.body;

    // Find and update the report
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      { type, message },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report updated successfully', report: updatedReport });
  } catch (error) {
    res.status(500).json({ message: 'Error editing report', error: error.message });
  }
};

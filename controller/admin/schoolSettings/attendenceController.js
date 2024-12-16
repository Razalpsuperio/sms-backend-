import Attendance from "../../../models/schema/Attendence.js";
import Batch from "../../../models/schema/Batch.js";
import Student from "../../../models/schema/Student.js";




export const getStudentsByModuleForAttendance = async (req, res) => {
    try {
      const { moduleId,batchId } = req.params;
     const batch = await Batch.findById(batchId).populate('students')
      // Find students whose performance array contains the module with 'pending' or 'notCompleted' status
      if (!batch) {
        return res.status(404).json({ message: 'Batch not found' });
      }
  
      // Filter students based on their performance in the specified module
      const filteredStudents = batch.students.filter(student =>
        student.performance.some(perf =>
          perf.moduleID.toString() === moduleId &&
          ['pending', 'notCompleted'].includes(perf.status)
        )
      );
      res.status(200).json(filteredStudents);
    } catch (error) {
      console.error('Error fetching students for attendance:', error);
      res.status(500).json({ message: 'Error fetching students for attendance', error: error.message });
    }
  };

 export const getModulesByBatchForAttendance = async (req, res) => {
    try {
      const { batchId } = req.params;
      
      // Find the batch by ID and populate the module field
      const batch = await Batch.findById(batchId).populate('module.moduleID');
  
      if (!batch) {
        return res.status(404).json({ message: 'Batch not found' });
      }
  
      // Extract the modules from the batch
      const modules = batch.module.map(mod => ({
        moduleID: mod.moduleID._id,
        moduleName: mod.moduleID.title, // Assuming the CourseModule schema has a 'name' field
        status: mod.status
      }));
  
      // Return the modules as JSON
      res.status(200).json({ modules });
    } catch (error) {
      console.error('Error fetching modules for attendance:', error);
      res.status(500).json({ message: 'Error fetching modules for attendance', error: error.message });
    }
  };
export const getStudentsByBatchForAttendance = async (req, res) => {
    try {
     
      const { batchId } = req.params;
      const batchStudents = await Batch.findOne({ _id: batchId}).populate("students")
      if (batchStudents) {
        res.status(200).json(batchStudents.students);
      } else {
        res.status(404).json({ message: 'Batch not found' });
      }
    


    } catch (error) {
        console.error('Error fetching students for attendance:', error);
      res.status(500).json({ message: 'Error fetching students for attendance', error: error.message });
    }
}





export const recordAttendance = async (req, res) => {
    try {
      const { studentId, date, status, moduleId } = req.body;
  
      // Check if attendance already exists for the student on the given date and module
      const existingRecord = await Attendance.findOne({ studentId, date, moduleId });
      if (existingRecord) {
        return res.status(400).json({ message: 'Attendance already recorded for this date and module.' });
      }
  
      // Create new attendance record
      const attendance = new Attendance({
        studentId,
        date,
        status,
        moduleId,
      });
  
      await attendance.save();
      res.status(201).json({ message: 'Attendance recorded successfully', attendance });
    } catch (error) {
      res.status(500).json({ message: 'Error recording attendance', error: error.message });
    }
  };


  // Get Attendance by Student ID
export const getAttendanceByStudent = async (req, res) => {
    try {
      const { studentId } = req.params;
      const attendanceRecords = await Attendance.find({ studentId }).populate('moduleId');
      res.status(200).json(attendanceRecords);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching attendance', error: error.message });
    }
  };



  // Get Attendance by Module ID
export const getAttendanceByModule = async (req, res) => {
    try {
      
      const { moduleId } = req.params;
      const attendanceRecords = await Attendance.find({moduleId }).populate('studentId');
      console.log(attendanceRecords);
      
      res.status(200).json(attendanceRecords);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching attendance', error: error.message });
    }
  };
  
  // Update Attendance
  export const updateAttendance = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const attendance = await Attendance.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!attendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
  
      res.status(200).json({ message: 'Attendance updated successfully', attendance });
    } catch (error) {
      res.status(500).json({ message: 'Error updating attendance', error: error.message });
    }
  };
  
  // Delete Attendance
  export const deleteAttendance = async (req, res) => {
    try {
      const { id } = req.params;
      const attendance = await Attendance.findByIdAndDelete(id);
  
      if (!attendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
  
      res.status(200).json({ message: 'Attendance deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting attendance', error: error.message });
    }
  };
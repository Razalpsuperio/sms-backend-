import mongoose from "mongoose";
import AddBatch from "../../models/schema/AddBatch.js";
import Classroom from "../../models/schema/classroom.js";
import Session from "../../models/schema/ClassSession.js";
import Student from "../../models/schema/Student.js";
import BatchesClass from "../../models/schema/AddBatch.js";



// Functions for fetch all students based on the current colleges
export const getAllStudents = async (req, res) => {
    try {
      const students = await Student.find()
      console.log(students)
      
      if (!students) {
        res.status(404).json({ message: "student not found" });
      } else {

        // Process the fetched students data
        res.status(200).json(students);

      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  };


  export const addNewStudent = async (req, res) => {
    try {
      console.log("Adding new student")
      const {
        fullName: name,
        email,
        // phone,
        passport,
        representative,
        agents,
        college,
        course,
        installment,
        year, 
        tenure,
        intake,
        tenureDate,
        // addressLine1,
        // addressLine2,
        city,
        state,
        country,
        zip,
      } = req.body;
      const studentExist = await Student.findOne({ email });
      // if (studentExist) {
      //   return res.status(409).json({
      //     status: "error",
      //     message: "student already exists",
      //   });
      // }

      
      const student = new Student({
        name,
        // phone,
        email,
        passport,
        representative,
        college,
        course,
        agents,
        installment,
        year,
        tenure: tenure,
        intake,
        balancedFees: 0,
        isBatch: false,
        address: {
          // addressLine1,
          // addressLine2,
          city,
          state,
          zip,
          country,
        },
      });
   
      const savedStudent = await student.save();


      res.status(201).json(savedStudent);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "An error occurred" });
    }
  };


  export const editStudent = async (req, res) => {
    try {
      const { studentId } = req.params;
      const {
        fullName: name,
        email,
        passport,
        college,
        course,
        agent,
        country,
        state,
      } = req.body;
      const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        {
          name,
          email,
          // phone,
          passport,
          college,
          course,
          agent,
          address: {
            state,
            country,
          },
        },
        { new: true }
      );
      if (!updatedStudent) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.status(200).json(updatedStudent);
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  };




  export const getStudentBasedOnCourse = async (req, res) => {
    try {

      const classroom = await Classroom.findOne({ _id: req.params.classRoomId })
      
      if (!classroom) {
        return res.status(404).json({ message: "Classroom not found" });
      } else {
        const students = await Student.find({ course: classroom.courseId._id, isBatch: false });
  
        if (students.length > 0) {
          return res.status(200).json(students);
        } else {
          return res.status(404).json({ message: "No students found" });
        }
      }
    } catch (error) {

      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
  };


  export const assignStudent = async (req, res) => {
    const { sessionId } = req.params;
    const { studentIds } = req.body;
    console.log("Received sessionId:", sessionId);
    console.log("Received studentIds:", studentIds);
  
    try {
      const session = await Session.findById(sessionId).populate('classroomId');
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
  
      const classroom = session.classroomId;
      if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
  
      const currentStudentCount = session.students.length;
      const newStudentCount = studentIds.length;
  
      if (currentStudentCount + newStudentCount > classroom.toCapacity) {
        return res.status(400).json({
          message: `Cannot assign students. Maximum capacity of ${classroom.toCapacity} will be exceeded.`,
        });
      }
  
      // Check for duplicates and filter out students already in the session
      const filteredStudentIds = studentIds.filter(id => !session.students.includes(id));
  
      if (filteredStudentIds.length === 0) {
        return res.status(400).json({
          message: 'All provided students are already assigned to this session.',
        });
      }
  
      // Check if the filtered students exist in the database
      const students = await Student.find({ _id: { $in: filteredStudentIds } });
      if (students.length !== filteredStudentIds.length) {
        return res.status(404).json({ message: 'One or more students not found' });
      }
  
      console.log("Current session students:", session.students);
      session.students.push(...filteredStudentIds); // Add only new students to the session
      console.log("Updated session students:", session.students);
  
      await session.save();
  
      res.status(200).json({
        message: 'Students assigned successfully',
        session,
      });
    } catch (error) {
      console.error("Error in assignStudent:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  export const clearAllStudents = async (req, res) => {
    const { sessionId } = req.params;
  
    try {
      // Find the session by its ID
      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
  
      // Clear the students array
      session.students = [];
  
      // Save the updated session
      await session.save();
  
      res.status(200).json({
        message: 'All students have been cleared from the session successfully',
        session,
      });
    } catch (error) {
      console.error("Error in clearAllStudents:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const removeStudent = async (req, res) => {
    const { sessionId, studentId } = req.params;
  
    try {

      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
  
      // Check if the student exists in the session
      const studentIndex = session.students.indexOf(studentId);
      if (studentIndex === -1) {
        return res.status(404).json({ message: 'Student not found in this session' });
      }
  
      // Remove the student from the session's students array
      session.students.splice(studentIndex, 1);
  
      // Save the updated session
      await session.save();
  
      res.status(200).json({
        message: `Student with ID ${studentId} has been removed from the session successfully`,
        session,
      });
    } catch (error) {
      console.error("Error in removeStudent:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  

  export const getStudentInSession = async (req, res) => {
    try {
  
      const { sessionId } = req.params;
      console.log("Studentsdvhjsdhdscvdshvchjdsgvchjdsgajkgdjhgasdjgvdsjkgj")
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
  
      const session = await Session.findById(sessionId)
        .populate({
          path: "students",
          select: "name email phone", 
        })
        .exec();

        console.log(session)
  
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
  

  
      res.status(200).json({ message: "Students fetched successfully", session });
    } catch (error) {
      console.error("Error in getStudentInSession:", error);
      res.status(500).json({ message: "An error occurred while fetching students", error: error.message });
    }
  };

  export const createAddBatch = async (req, res) => {
    const { batchName, startDate, endDate, classroomId } = req.body;
  
    if (!batchName || !startDate || !endDate || !classroomId) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
  
    try {
      const newBatch = new BatchesClass({
        batchName,
        startDate,
        endDate,
        classroomId,
      });
  
      const savedBatch = await newBatch.save();
  
      res.status(201).json({ message: "Batch added successfully", batch: savedBatch });
    } catch (error) {
      console.error("Error adding batch:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  export const getBatches = async (req, res) => {
    try {

      const { batchName, startDate, endDate, classroomId } = req.body;

      const batches = await BatchesClass.find();
  
      // Check if there are any batches
      if (batches.length === 0) {
        return res.status(404).json({ message: "No batches found" });
      }
  
      // Send back the batches
      res.status(200).json({ message: "Batches retrieved successfully", batches });
    } catch (error) {
      console.error("Error retrieving batches:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  export const getBatchById = async (req, res) => {
    try {
    const { classroomId } = req.params;

    // Check if the classroomId is a valid MongoDB Object ID
    if (!mongoose.Types.ObjectId.isValid(classroomId)) {
      return res.status(400).json({ message: 'Invalid classroom ID' });
    }

    // Find batches associated with the classroomId
    const batches = await BatchesClass.find({ classroomId });

    if (!batches || batches.length === 0) {
      return res.status(404).json({ message: 'No batches found for this classroom' });
    }

    // Respond with the list of batches
    res.status(200).json({ message: 'Batches retrieved successfully', batches });
  } catch (error) {
    console.error('Failed to get batches:', error);
    res.status(500).json({ message: 'Failed to retrieve batches', error: error.message });
  }
  }

  export const updateBatch = async (req, res) => {
    try {
      const { id } = req.params;
      const { batchName, startDate, endDate, classroomId } = req.body;
  
      try {
        const updatedBatch = await BatchesClass.findByIdAndUpdate(
          id,
          { batchName, startDate, endDate, classroomId },
          { new: true, runValidators: true } 
        );
  
        if (!updatedBatch) {
          return res.status(404).json({ message: 'Batch not found' });
        }
  
        return res.status(200).json({ message: 'Batch updated successfully', batch: updatedBatch });
      } catch (error) {
        return res.status(500).json({ message: 'Error when editing', error: error.message });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  export const deleteBatch = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedBatch = await BatchesClass.findByIdAndDelete(id);
  
      if (!deletedBatch) {
        return res.status(404).json({ message: 'Batch not found' });
      }
  
      return res.status(200).json({ message: 'Batch deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting batch', error: error.message });
    }
  };
  
  
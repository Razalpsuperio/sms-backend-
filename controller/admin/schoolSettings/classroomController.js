import Attendance from "../../../models/schema/Attendence.js";
import Batch from "../../../models/schema/Batch.js";
import Classroom from "../../../models/schema/classroom.js";
import Session from "../../../models/schema/ClassSession.js";
import MarkAttendance from "../../../models/schema/MarkAttendance.js";
import Student from "../../../models/schema/Student.js";
import bcrypt from 'bcrypt'
export const getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find({courseId: req.params.courseId});
        if (!classrooms) {
            return res.status(404).json({ message: "Classrooms not found" });
        }else {

            res.status(200).json({ success: true, data: classrooms });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const addNewClassroom = async (req, res) => {
    try {
      const { courseId } = req.params;
      const { className, classCode, fromCapacity, toCapacity, description, classStatus } = req.body;
  
      const newClass = new Classroom({
        className,
        classCode,
        fromCapacity,
        toCapacity,
        description,
        classStatus,
        courseId,
      });
  
      const savedClass = await newClass.save();
      console.log('success',savedClass);
      res.status(201).json(savedClass);
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

export const editClassroom = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const updatedClass = await Classroom.findByIdAndUpdate(classroomId, req.body, {
            new: true, 
            runValidators: true 
        });

        if (!updatedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.json(updatedClass);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}


export const deleteClassroom = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const deletedClass = await Classroom.findByIdAndDelete(classroomId);

        if (!deletedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.json({ message: 'Class deleted successfully', deletedClass });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

//------------------------classSession Controllers-----------------------//

// Get all sessions for a specific classroom
export const getSessionsByClassroom = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const { batchId } = req.body; // Changed from req.query to req.body
        
        const query = { classroomId };
        if (batchId) {
            query.batchId = batchId;
        }
        
        const sessions = await Session.find(query);
        
        if (!sessions.length) {
            return res.status(404).json({ 
                message: "No sessions found for this classroom/batch combination" 
            });
        }
        
        res.status(200).json({ success: true, data: sessions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

  
  //add session


  export const addSession = async (req, res) => {
    try {
      const {
        sessionName,
        sessionStartTime,
        sessionEndTime,
        classroomId,
        quantity,
        capacity,
        batchId  // Add this to destructure batchId from request body
      } = req.body;
  
      // Input validation
      if (!batchId) {
        return res.status(400).json({ message: "Batch ID is required" });
      }
  
      const newSession = new Session({
        sessionName,
        sessionStartTime,
        sessionEndTime,
        classroomId,
        quantity,
        capacity,
        batchId  
      });
  
      const savedSession = await newSession.save();
      res.status(201).json(savedSession);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // Edit an existing session with inventory
  export const editSession = async (req, res) => {
    const { id } = req.params;
    try {
      const { sessionName, sessionStartTime, sessionEndTime, classroomId, inventory } = req.body;
  
      const updatedSession = await Session.findByIdAndUpdate(
        id,
        { sessionName, sessionStartTime, sessionEndTime, classroomId, inventory },
        { new: true }
      );
  
      if (!updatedSession) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.status(200).json(updatedSession);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Delete a session
  export const deleteSession = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedSession = await Session.findByIdAndDelete(id);
      if (!deletedSession) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.status(200).json({ message: "Session deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


// add Students to a session
export const addStudentsInSession = async (req, res) => {
    const { sessionId } = req.params;
    const { studentIds } = req.body;  // Expecting an array of student IDs

    try {
        // Find the session by ID
        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Ensure studentIds is an array and has at least one ID
        if (!Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({ message: 'No students provided' });
        }

        // Filter out students who are already in the session
        const newStudents = studentIds.filter(studentId => !session.students.includes(studentId));

        if (newStudents.length === 0) {
            return res.status(400).json({ message: 'All students are already in this session' });
        }

        // Add the new students to the session
        session.students.push(...newStudents);

        // Save the updated session
        await session.save();

        return res.status(200).json({
            message: 'Students added successfully',
            session,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//------------------------Batch Controllers-----------------------//

// Create a new batch

export const createBatch = async (req, res) => {
    try {

      const { name, students, batchCode, description, startDate, endDate, intakeDate } = req.body;

  
      const classroom = await Classroom.findOne({ _id: req.params.id }).populate('courseId');
      
      if (!classroom) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      // Map through the moduleId array and prepare the module field
      const modules = classroom.courseId.moduleId.map(moduleId => ({
        moduleID: moduleId,
        status: 'pending'
      }));
  
      const newBatch = new Batch({
        name,
        students,
        classId: classroom._id,
        courseId: classroom.courseId._id,
        batchCode,
        description,
        startDate,
        endDate,
        intakeDate,
        module: modules,  // Assign the modules array
      });
  
      if (students && students.length > 0) {
        // Update each student with the module information
        await Promise.all(
          students.map(async (studentId) => {
            await Student.findByIdAndUpdate(
              studentId,
              {
                $set: { isBatch: true },
                $push: { performance: { $each: modules } }, // Push all modules to student's performance
              }
            );
          })
        );
      }
  
      const savedBatch = await newBatch.save();
      res.status(201).json(savedBatch);
    } catch (error) {
      console.error('Error creating batch:', error);
      res.status(400).json({ message: error.message });
    }
  };
  

// Edit an existing batch
export const editBatch = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedBatch = await Batch.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        if (!updatedBatch) {
            return res.status(404).json({ message: "Batch not found." });
        }

        res.status(200).json(updatedBatch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an existing batch
export const deleteBatch = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBatch = await Batch.findByIdAndDelete(id);

        if (!deletedBatch) {
            return res.status(404).json({ message: "Batch not found." });
        }

        res.status(200).json({ message: "Batch deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



export const getBatch = async (req, res) => {
    try {
        const { id } = req.params;

       
        const batch = await Batch.findById(id)
            .populate({
                path: 'students',
                populate: {
                    path: 'performance.moduleID',
                    model: 'CourseModule' 
                }
            })
            .populate('module.moduleID'); 


        if (!batch) {
            return res.status(404).json({ message: "Batch not found." });
        }

        res.status(200).json(batch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const getBatchStudents = async (req, res) => {
    try {
   
        const classroom = await Classroom.findOne({ _id: req.params.id }).populate( 'courseId' );
        
        if (!classroom) {
            return res.status(404).json({ message: "classroom not found" });
        }else {
             const students = await Student.find({course:classroom.courseId._id ,isBatch:false});
             
             if (students.length > 0) {
                 return res.status(200).json(students);
            
             }else {
                 return res.status(404).json({ message: "No students found" });
             }
         }
    } catch (error) {
    
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}

// Function All Batch

export const fetchAllBatch = async (req, res) => {
    try {


        // Fetch and sort batches in descending order based on the desired field (e.g., createdAt)
        const batches = await Batch.find({ classId: req.params.classId }).sort({ createdAt: -1 });



        if (batches.length > 0) {
            return res.status(200).json({
                message: "Successfully fetched batches",
                data: batches,
            });
        } else {
            return res.status(404).json({ message: "No batches found" });
        }
    } catch (error) {
        console.error("Error fetching batches:", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}



export const transferModuleToBatch = async (req, res) => {
    try {
        const { batchId, moduleId, status } = req.body;

        // Find the batch by its ID
        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }        

        // Check if the batch has any modules
        if (!batch.module || batch.module.length === 0) {
            return res.status(400).json({ message: "No modules found in this batch" });
        }

        // Update the status of the specified module
        batch.module = batch.module.map((item) => {
            
            if (item.moduleID == moduleId) {
                
                
                item.status = status;

                if (item.status == status) {
                    // Update student performance for this module
                    batch.students.forEach(async (studentId) => {                        
                        const student = await Student.findById(studentId);
                                    
                        if (student) {
                            student.performance = student.performance.map((performance) => {
                                if (performance.moduleID == moduleId && performance.status != 'notCompleted') {                                    
                                    performance.status = status;
                                }
                                return performance;
                            });
                            await student.save();
                        }
                    });
                }   
            }
            return item;
        });

        // Save the updated batch
        await batch.save();

        return res.status(200).json({ message: "Module status updated successfully", batch });
    } catch (error) {
        console.error("Error transferring module to batch:", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export const updateStudentModuleStatus = async (req, res) => {
    try {

   
        const { moduleId, status } = req.body;
        console.log("Module status updated",req.body)
  
        const student =   await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }else{
            student.performance = student.performance.map((performance) => {
                if (performance.moduleID == moduleId) {
                    performance.status = status;
                }
                return performance;
            });
            await student.save();
            return res.status(200).json({ message: "Student module status updated successfully", student });
        }
    } catch (error) {
        console.error("Error updating student module status:", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const getAllBatchInClassroom = async(req,res) => {
    try {
        const {courseId} = req.params;
        const batches = await Batch.find({ courseId: courseId })
        if (batches.length > 0) {
            return res.status(200).json({ message: "Batches in classroom found successfully", batches });
        } else {
            return res.status(404).json({ message: "No batches found in this classroom" });
        }

    }catch (error) {
        console.error("Error fetching batches in classroom:", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }


}


// ATTANCE 

export const MarkAttendanceStudents = async (req, res) => {
    try {
        const { sessionId, studentId, date, status } = req.body;

        // Normalize the date to midnight for comparison
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Disallow marking attendance for past dates
        if (attendanceDate < today) {
            return res.status(400).json({
                error: 'Cannot mark attendance for past dates'
            });
        }

        // Validate session and student existence
        const [sessionExists, studentExists] = await Promise.all([
            Session.findById(sessionId),
            Student.findById(studentId),
        ]);

        if (!sessionExists || !studentExists) {
            return res.status(404).json({
                error: !sessionExists ? 'Session not found' : 'Student not found',
            });
        }

        // Upsert attendance record (update if exists, insert otherwise)
        const savedAttendance = await MarkAttendance.findOneAndUpdate(
            {
                sessionId,
                studentId,
                date: attendanceDate,
            },
            { $set: { status } },
            { new: true, upsert: true } // Return the updated document or insert a new one
        );

        res.status(200).json({
            
            savedAttendance,
         
        });
    } catch (error) {
        console.error('Error in MarkAttendanceStudents:', error);
        res.status(500).json({
            error: 'An error occurred while marking attendance',
        });
    }
};

export const getAttendance = async (req, res) => {
    console.log("helllllllllo")
    const { sessionId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day

    try {
        const attendanceRecords = await MarkAttendance.find({
            sessionId,
            date: { $gte: today, $lt: new Date(today).setHours(23, 59, 59, 999) } // Today's range
        })
        .populate("studentId", "name") // Populate student name
        .exec();

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({ message: "No attendance records found for today" });
        }

        res.status(200).json({ message: "Attendance records fetched successfully", data: attendanceRecords });
    } catch (error) {
        console.error("Error retrieving attendance:", error);
        res.status(500).json({ message: "Error retrieving attendance", error });
    }
};

  



  export const CheckTodayAttendance = async (req, res) =>async (req, res) => {
    try {
      const { studentId } = req.params;
  
      // Get today's date in the format YYYY-MM-DD
      const today = moment().startOf('day').toDate();  // This will give you the start of the day (00:00:00)
  
      // Find if attendance for the student has been marked today
      const attendance = await MarkAttendance.findOne({
        studentId,
        date: {
          $gte: today,  // Checks if the date is today or after
          $lt: moment(today).endOf('day').toDate(),  // Ensures the check is within the 24-hour period of today
        }
      }).populate("sessionId", "date").populate("studentId", "name");
  
      if (!attendance) {
        return res.status(404).json({ message: "Attendance for today is not marked." });
      }
  
      res.status(200).json({ message: "Attendance for today is marked.", attendance });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }


  import mongoose from "mongoose"; // Add this line if missing

  export const getAttendancePerformance = async (req, res) => {
      try {
          let { studentId } = req.params;
          console.log("dskjbjjdscdjsncjkdsncjkdsjcdsjndsjcnjcnjdskn")
  
          // Trim and validate the studentId
          studentId = studentId.trim();
          if (!mongoose.isValidObjectId(studentId)) {
              return res.status(400).json({ error: "Invalid student ID format" });
          }
  
          // Validate student existence
          const studentExists = await Student.findById(studentId);
          if (!studentExists) {
              return res.status(404).json({ error: "Student not found" });
          }
  
          // Fetch all attendance records for the student
          const attendanceRecords = await MarkAttendance.find({ studentId });
  
          if (!attendanceRecords || attendanceRecords.length === 0) {
              return res.status(404).json({
                  message: "No attendance records found for this student",
              });
          }
  
          // Calculate performance metrics
          const totalClasses = attendanceRecords.length;
          const attendedClasses = attendanceRecords.filter(
              (record) => record.status === "present"
          ).length;
          const absentClasses = attendanceRecords.filter(
              (record) => record.status === "absent"
          ).length;
          const medicalLeaves = attendanceRecords.filter(
              (record) => record.status === "medical"
          ).length;
  
          const attendancePercentage =
              totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(2) : 0;
  
          // Response data
          const performanceData = {
              totalClasses,
              attendedClasses,
              absentClasses,
              medicalLeaves,
              attendancePercentage: `${attendancePercentage}%`,
          };
  
          res.status(200).json({
              message: "Attendance performance fetched successfully",
              student: { id: studentExists._id, name: studentExists.name },
              performance: performanceData,
          });
      } catch (error) {
          console.error("Error in getAttendancePerformance:", error);
          res.status(500).json({
              error: "An error occurred while fetching attendance performance",
          });
      }
  };

  // Backend API endpoint
  export const getMonthlyAttendancePerformance = async (req, res) => {
    try {
        let { studentId } = req.params;
        
        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).json({ error: "Invalid student ID format" });
        }

        const studentExists = await Student.findById(studentId);
        if (!studentExists) {
            return res.status(404).json({ error: "Student not found" });
        }

        const currentYear = new Date().getFullYear();
        
        const monthlyAttendance = await MarkAttendance.aggregate([
            {
                $match: {
                    studentId: new mongoose.Types.ObjectId(studentId),
                    date: {
                        $gte: new Date(currentYear, 0, 1),
                        $lte: new Date(currentYear, 11, 31)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$date" },
                    totalClasses: { $sum: 1 },
                    presentClasses: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "present"] }, 1, 0]
                        }
                    },
                    absentClasses: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "absent"] }, 1, 0]
                        }
                    },
                    medicalLeaves: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "medical"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    totalClasses: 1,
                    presentClasses: 1,
                    absentClasses: 1,
                    medicalLeaves: 1,
                    presentPercentage: {
                        $multiply: [
                            { $divide: ["$presentClasses", "$totalClasses"] },
                            100
                        ]
                    }
                }
            },
            {
                $sort: { month: 1 }
            }
        ]);

        // Comprehensive month mapping
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const formattedData = monthNames.map((monthName, index) => {
            const monthData = monthlyAttendance.find(item => item.month === index + 1) || {
                totalClasses: 0,
                presentClasses: 0,
                absentClasses: 0,
                medicalLeaves: 0,
                presentPercentage: 0
            };

            return {
                month: monthName,
                present: monthData.presentPercentage || 0,
                absent: ((monthData.absentClasses + monthData.medicalLeaves) / (monthData.totalClasses || 1) * 100) || 0
            };
        });

        res.status(200).json({
            message: "Monthly attendance performance fetched successfully",
            student: { id: studentExists._id, name: studentExists.name },
            monthlyPerformance: formattedData
        });

    } catch (error) {
        console.error("Error in getMonthlyAttendancePerformance:", error);
        res.status(500).json({
            error: "An error occurred while fetching monthly attendance performance"
        });
    }
};

// Add this to your routes file

import SmsUser from "../../../models/schema/SmsUser.js";
import Course from "../../../models/schema/Courses.js";

export const SMSregisterUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
  
    try {
      const existingUser = await SmsUser.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new SmsUser({ email, password: hashedPassword });
  
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };


  export const SMSloginUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
  
    try {
      const user = await SmsUser.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      res.status(200).json({ message: 'Login successful.', user });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  export const SMSgetAllUsers = async (req, res) => {
    try {
      const users = await SmsUser.find().select('-password'); 
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };


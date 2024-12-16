import mongoose from "mongoose";
import Admin from "../../../models/schema/Admin.js";
import College from "../../../models/schema/College.js";
import Course from "../../../models/schema/Courses.js";
import Representative from "../../../models/schema/Representative.js";
import Agent from "../../../models/schema/Agent.js";

// -------------- Course Section --------------------

export const addNewCourse = async (req, res) => {
  try {
    const { course, duration, fees, applicationFees, categoryId, moduleIds, status } = req.body;

    const newCourse = new Course({
      course,
      duration,  // The duration is already formatted as "X-months" from the frontend
      fees: Number(fees),
      applicationFees,
      categoryId,
      moduleId: moduleIds || [], 
      status: status || 'active'  // Use the provided status or default to 'active'
    });

    const savedCourse = await newCourse.save();

    if (moduleIds) {
      const modules = await courseModule.find({ _id: { $in: moduleIds } });
      if (modules.length !== moduleIds.length) {
        return res.status(404).json({ message: "One or more modules not found" });
      }
    }

    if (savedCourse) {
      const collegeData = await College.findById("66681b57851e91abd2089a4c");
      if (collegeData) {
        collegeData.courses.push(new mongoose.Types.ObjectId(savedCourse._id));
        const savedCollege = await collegeData.save();

        if (savedCollege) {
          const courseCommissionObj = {
            college: collegeData.name,
            course: savedCourse.course,
            courseId: savedCourse._id,
            courseFee: savedCourse.fees,
            commission: 0,
          };

          const superAdmin = await Admin.findOne({ type: "super-admin" }).select("courseCommission");
          if (superAdmin) {
            superAdmin.courseCommission.push(courseCommissionObj);
            await superAdmin.save();

            await addCourseCommissionsToAgentRep(collegeData, courseCommissionObj);

            return res.status(201).json(savedCourse);
          } else {
            return res.status(404).json({ message: "Super admin not found" });
          }
        } else {
          return res.status(500).json({ message: "Cannot save college" });
        }
      } else {
        return res.status(404).json({ message: "College not found" });
      }
    } else {
      return res.status(500).json({ message: "Cannot save course" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred" });
  }
};
  
  // Function for fetching all courses based on the current college
  export const fetchAllCourses = async (req, res) => {
    try {
      const collegeId = req.params.collegeId;
      const college = await College.findById(collegeId).populate("courses").exec();
  
      if (!college) {
        res.status(404).json({ message: "College not found" });
      } else {
        res.status(200).json(college.courses);
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  };
  
  // Function for fetching course names for form options
  export const fetchCoursesName = async (req, res) => {
    try {
      const courses = await Course.find({}).select("course");
      if (courses.length > 0) {
        res.status(200).json(courses);
      } else {
        res.status(404).json({ message: "Courses not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  };
  
  // Function for fetching modules by course
  export const fetchModuleByCourse = async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const course = await Course.findById(courseId).populate("moduleId");
      if (course) {
        res.status(200).json({
          status: "success",
          data: course,
        });
      } else {
        res.status(404).json({ message: "Course not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  };
  
  // Function for fetching course options for a specific college
  export const fetchCourseOption = async (req, res) => {
    try {
      const { collegeId } = req.params;
      const college = await College.findById(collegeId).populate("courses").select("courses");
  
      if (college) {
        res.status(200).json(college.courses);
      } else {
        res.status(404).json({ message: "College not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  };
  
  // Function for deleting a course
  export const deleteCourse = async (req, res) => {
    try {

      const { courseId } = req.params;
   
      const foundDocument = await College.findOne({ courses: courseId }).select("courses _id");

      if (foundDocument) {
        const index = foundDocument.courses.indexOf(courseId);
        if (index !== -1) {
          foundDocument.courses.splice(index, 1);
          await foundDocument.save();
          await removeCourseCommissionFromAgentRep(courseId, foundDocument._id);
        }
      }
   
      await Course.findByIdAndDelete(courseId);
      console.log("successfully")
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  };

 export const editCourse = async (req, res) => {
    const { courseId } = req.params;
  
    try {
      const updatedFields = req.body; 
  

      if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ error: 'No fields to update provided' });
      }
  

      const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedFields, {
        new: true, 
        runValidators: true, 
      });
  
      if (!updatedCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      res.status(200).json({ success: true, data: updatedCourse });
    } catch (error) {
      console.error('Error updating course:', error.message);
      res.status(500).json({ error: 'An error occurred while updating the course' });
    }
  };
  
  // Helper function to add course commissions to agents and representatives
  const addCourseCommissionsToAgentRep = async (collegeData, courseCommissionObj) => {
    try {
      const repArray = collegeData.representatives;
      const agentArray = collegeData.agents;
  
      if (repArray.length > 0) {
        repArray.forEach(async (repId) => {
          const representative = await Representative.findById(repId).select("courseCommission");
          if (representative) {
            representative.courseCommission.push(courseCommissionObj);
            await representative.save();
          }
        });
      }
  
      if (agentArray.length > 0) {
        agentArray.forEach(async (agentId) => {
          const agent = await Agent.findById(agentId).select("courseCommission");
          if (agent) {
            agent.courseCommission.push(courseCommissionObj);
            await agent.save();
          }
        });
      }
  
      return true;
    } catch (error) {
      return error;
    }
  };
  

  export const getCollege = async (req,res) => {
    try {
      const college = await College.find();
 
       if(college){
        res.status(200).json({ message: "Colleges fetched successfully" ,data:college});
       }else{
        res.status(404).json({ message: "No colleges found" });
       }
    } catch (error) {
      console.error("Error fetching colleges:", error);
      throw error;
    }
  };

  export const fetchCourse = async (req, res) => {
    try {
      const course = await Course.find().populate('moduleId').populate('categoryId');


      if (course.length > 0) {
        return res.status(200).json({
          message: "Successfully fetched Course",
          data: course,
        });
      } else {
        return res.status(404).json({ message: "No Course found" });
      }
    } catch (error) {
      console.error("Error fetching Course:", error.message);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

  export const getModules =  async (req, res) => {
    try {
      const { courseId } = req.params;
  
      // Find the course by its ID and populate the modules
      const course = await Course.findById(courseId).populate('moduleId');
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Return the populated course with modules
      res.status(200).json(course.moduleId);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  
  
  
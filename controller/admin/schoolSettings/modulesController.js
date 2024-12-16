import CourseModule from "../../../models/schema/CourseModule.js";

// Function to add a Course Module
export const addCourseModule = async (req, res) => {
  try {
    const { title, moduleCode, duration, images, documents, status, categoryId, description, startDate, endDate, instructor, level, prerequisites } = req.body;
    
    const module = new CourseModule({
      title,
      moduleCode,
      duration,
      images,
      documents,
      status,
      categoryId,
      description,
      startDate,
      endDate,
      instructor,
      level,
      prerequisites,
    });

    await module.save();
    console.log("module saved", module);
    return res.status(201).json({ message: "Module added successfully", module });
  } catch (error) {
    console.error("Error adding module to course:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Function to delete a Module from a course
export const deleteCourseModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const module = await CourseModule.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    await CourseModule.deleteOne({ _id: moduleId });

    return res.status(200).json({ message: "Module deleted successfully" });
  } catch (error) {
    console.error("Error deleting module from course:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Function to edit a module in a course
export const editCourseModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, moduleCode, duration, images, documents, status, categoryId, description, startDate, endDate } = req.body;  

    const module = await CourseModule.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    module.title = title || module.title;
    module.moduleCode = moduleCode || module.moduleCode;
    module.duration = duration || module.duration;
    module.images = images || module.images;
    module.documents = documents || module.documents;
    module.status = status || module.status;
    module.categoryId = categoryId || module.categoryId;
    module.description = description || module.description;
    module.startDate = startDate || module.startDate;
    module.endDate = endDate || module.endDate;

    await module.save();

    return res.status(200).json({ message: "Module updated successfully", module });
  } catch (error) {
    console.error("Error editing module in course:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Function to fetch course modules
export const fetchCourseModule = async (req, res) => {
  try {
    const modules = await CourseModule.find().populate('categoryId');
    console.log(modules);
    if (modules.length > 0) {
      return res.status(200).json({
        message: "Successfully fetched modules",
        data: modules,
      });
    } else {
      return res.status(404).json({ message: "No modules found" });
    }
  } catch (error) {
    console.error("Error fetching modules:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

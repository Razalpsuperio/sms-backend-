import Lesson from "../../../models/schema/CourseLesson.js";
import CourseModule from "../../../models/schema/CourseModule.js";

// -------------- Lesson Section --------------------

// Function to add a lesson to a course module
export const addLessonToCourse = async (req, res) => {
  try {
    const { moduleId, categoryId, status, title, code, duration, description, startDate, endDate } = req.body;
    console.log(req.body); 
    const module = await CourseModule.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const lesson = new Lesson({
      moduleId,
      categoryId,
      status,
      title,
      code,
      duration,
      description,
      startDate,
      endDate,
    });

    await lesson.save();

    return res.status(201).json({ message: "Lesson added successfully", lesson });
  } catch (error) {
    console.error("Error adding lesson to module:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Function to delete a lesson from a module
export const deleteLessonFromCourse = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Use findByIdAndDelete to delete the lesson by its ID
    const lesson = await Lesson.findByIdAndDelete(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    return res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting lesson:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Function to edit a lesson in a module
export const editLessonInCourse = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { moduleId, categoryId, status, title, code, duration, description, startDate, endDate } = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    lesson.moduleId = moduleId || lesson.moduleId;
    lesson.categoryId = categoryId || lesson.categoryId;
    lesson.status = status || lesson.status;
    lesson.title = title || lesson.title;
    lesson.code = code || lesson.code;
    lesson.duration = duration || lesson.duration;
    lesson.description = description || lesson.description;
    lesson.startDate = startDate || lesson.startDate;
    lesson.endDate = endDate || lesson.endDate;

    await lesson.save();

    return res.status(200).json({ message: "Lesson updated successfully", lesson });
  } catch (error) {
    console.error("Error editing lesson in module:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Function to fetch lessons by module ID
export const fetchLessonsByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const lessons = await Lesson.find({ moduleId }).populate('moduleId').populate('categoryId');
    if (lessons.length > 0) {
      return res.status(200).json({
        message: "Successfully fetched lessons",
        data: lessons,
      });
    } else {
      return res.status(404).json({ message: "No lessons found for the given module ID" });
    }
  } catch (error) {
    console.error("Error fetching lessons:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Function to fetch all lessons
export const fetchLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().populate('moduleId').populate('categoryId');
    if (lessons.length > 0) {
      return res.status(200).json({
        message: "Successfully fetched lessons",
        data: lessons,
      });
    } else {
      return res.status(404).json({ message: "No lessons found" });
    }
  } catch (error) {
    console.error("Error fetching lessons:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

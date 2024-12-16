import { Router } from "express";
import { addNewClassroom, addSession, addStudentsInSession, CheckTodayAttendance, createBatch, deleteBatch, deleteClassroom, deleteSession, editBatch, editClassroom, editSession, fetchAllBatch, getAllBatchInClassroom, getAllClassrooms, getAttendance, getAttendancePerformance, getBatch, getBatchStudents, getMonthlyAttendancePerformance, getSessionsByClassroom, MarkAttendanceStudents, SMSgetAllUsers, SMSloginUser, SMSregisterUser, transferModuleToBatch, updateStudentModuleStatus } from "../../controller/admin/schoolSettings/classroomController.js";
import { addNewCourse, deleteCourse, editCourse, fetchAllCourses, fetchCourse, fetchCourseOption, fetchCoursesName, fetchModuleByCourse, getCollege, getModules } from "../../controller/admin/schoolSettings/courseController.js";
import { addCourseModule, deleteCourseModule, editCourseModule, fetchCourseModule } from "../../controller/admin/schoolSettings/modulesController.js";
import { getAllAssignments } from "../../controller/admin/schoolSettings/assignmentController.js";
import { addLessonToCourse, deleteLessonFromCourse, editLessonInCourse, fetchLessons, fetchLessonsByModule } from "../../controller/admin/schoolSettings/lessonsController.js";
import { addCategory, deleteCategory, editCategory, fetchCategory } from "../../controller/admin/schoolSettings/categoryController.js";
import { addModuleIdToGroupModule, createGroupModule, deleteGroupModule, deleteModuleIdFromGroupModule, editGroupModule, getGroupModules } from "../../controller/admin/schoolSettings/groupModuleController.js";
import { addNewInventoryItem, deleteInventoryItem, getAllInventoryItems, updateInventoryItem } from "../../controller/admin/schoolSettings/inventoryController.js";
import { assignStudent, clearAllStudents, createAddBatch, getStudentBasedOnCourse, getStudentInSession, removeStudent, updateBatch ,getBatches } from "../../controller/admin/studentsController.js";




const router = Router();

// Here is the route for classroom settings
router.get('/classrooms/:courseId', getAllClassrooms) // route for all classrooms

router.post('/add-classroom/:courseId', addNewClassroom) // route for add a new classroom

router.post('/edit-classroom/:classroomId', editClassroom) // route for edit a classroom

router.delete('/delete-classroom/:classroomId', deleteClassroom);

//  Here is the route for classroom sessions

router.post("/classSession/:classroomId/sessions", getSessionsByClassroom);// route for all classrooms

router.post("/classSessions/:classroomId/sessions", addSession); // route for add a new add classSession

router.put("/classSession/sessions/:sessionId", editSession); // route for edit a classSession

router.delete("/classSession/sessions/:sessionId", deleteSession); // route for delete a classSession

router.post('/classSession/:sessionId/add-students', addStudentsInSession); // route for delete a addStudentInSession

router.get('/batches/students/:id', getBatchStudents); // Get all batches with populated students

// Here is the route for course settings

router.get('/courses',fetchCourse ) // route for all course

router.get("/all-course-name/", fetchCoursesName); // Route to fetch information about all courses

router.get("/all-courses/:collegeId", fetchAllCourses); // Route to fetch information about all courses based on college

router.post("/add-course", addNewCourse); // route to add course information to database

router.patch("/delete-courses/:courseId", deleteCourse); // route to delete

router.put('/edit-course/:courseId',editCourse); // Route to edit courses 

router.get("/all-course-name/:collegeId", fetchCourseOption); // Route to fetch all courses names for options



// Here is the route for Category settings

router.get("/all-category", fetchCategory ); // Route to fetch information about all Lessons

router.post("/add-category", addCategory); // route to add Lessons information to database

router.delete("/delete-category/:categoryId", deleteCategory); // route to delete Lessons

router.put("/edit-category/:categoryId", editCategory); 


// Here is the route for modules settings

router.get("/all-modules", fetchCourseModule); // Route to fetch information about all modules

router.get ("/all-course-modules/:courseId",fetchModuleByCourse) // route to fetch modules by course

router.post("/add-module", addCourseModule); // route to add module information to database

router.delete("/delete-Module/:moduleId", deleteCourseModule); // route to delete module

router.put("/edit-Module/:moduleId", editCourseModule); // route to edit module

// Here is the route for course settings

router.get('/lessons',fetchLessons ) // route for all lessons

router.get("/all-lessons/:courseId", fetchLessonsByModule ); // Route to fetch information about all Lessons

router.post("/add-lesson", addLessonToCourse); // route to add Lessons information to database

router.delete("/delete-lesson/:lessonId", deleteLessonFromCourse); //delete lesson 

router.put("/edit-Lesson/:lessonId", editLessonInCourse); // route to edit Lesson

// Here is the route for course settings
router.get('/assignments', getAllAssignments) // route for all course

//college settings like collage adding
router.get('/getCollege', getCollege);

// Here is the route for inventory settings

router.get('/inventory', getAllInventoryItems);// Route to get all inventory items

router.post('/inventory', addNewInventoryItem);// Route to add a new inventory item

router.put('/inventory/:inventoryId', updateInventoryItem); // Route to update an inventory item by its ID

router.delete('/inventory/:inventoryId', deleteInventoryItem);// Route to delete an inventory item by its ID


// Here is the route for group settings

router.get('/groups', getGroupModules);

router.post('/groupAdd', createGroupModule);

router.delete('/group/:id', deleteGroupModule);

router.put('/group/:id', editGroupModule);

router.put('/group/:id/add-module', addModuleIdToGroupModule);

router.put('/group/:id/delete-module', deleteModuleIdFromGroupModule);

// Here is the route for
//-----Batch Routes------------//

router.get('/classroom/:courseId/batches', getAllBatchInClassroom); // Define the route to get all batches in a classroom by courseId

router.post('/batches/:id', createBatch); // Create a batch

router.put('/batches/:id', editBatch); // Edit a batch

router.delete('/batches/:id', deleteBatch); // Delete a batch

router.get('/batches/:id', getBatch); // Get a batch by ID with populated students

router.get('/batchesClass/:classId', fetchAllBatch); // Get all batches

router.post('/batch/updateModuleStatus', transferModuleToBatch); // Define the route for transferring module status in a batch

router.post('/student/updateModuleStatus/:id', updateStudentModuleStatus); // Define the route for updating student module status

router.get('/getStudentBasedOnCourse/:classRoomId', getStudentBasedOnCourse); // Get the student based on course id

router.post('/assign-students/:sessionId', assignStudent) // Assign the student based on session id

router.get('/get-assign-students/:sessionId', getStudentInSession) // Get the student if already exist or not 

router.delete('/remove-student/:sessionId/:studentId', removeStudent); // Delete the student from the assign

router.post('/clear-all-students/:sessionId', clearAllStudents); // Clear all the students from the assign

router.post('/addBatch', createAddBatch); // Create a batch of students that will be added to the class

router.post('/batches', getBatches); 

router.put('/batches/:id/edit', updateBatch); // Update a batch of students

router.delete('/batches/:id/delete', deleteBatch); // Delete a batch of students
//attance 
router.post('/mark-attendance', MarkAttendanceStudents)





router.get("/attendance/:sessionId",getAttendance)

router.get('/attendance/student/:studentId/today', CheckTodayAttendance);

router.get("/attendance/performance/:studentId", getAttendancePerformance);

router.get("/attendance/monthly-performance/:studentId", getMonthlyAttendancePerformance);

router.post('/register', SMSregisterUser);

// Login route
router.post('/login', SMSloginUser);

// Get all users route
router.get('/users', SMSgetAllUsers);
// modules 


router.get('/course/:courseId/modules',getModules);




export default router;
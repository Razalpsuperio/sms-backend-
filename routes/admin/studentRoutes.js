import { Router } from "express";
import { addNewStudent, editStudent, getAllStudents } from "../../controller/admin/studentsController.js";
import { deleteAttendance, getAttendanceByModule, getAttendanceByStudent, getModulesByBatchForAttendance, getStudentsByBatchForAttendance, getStudentsByModuleForAttendance, recordAttendance, updateAttendance } from "../../controller/admin/schoolSettings/attendenceController.js";
import { addReport, deleteReport, editReport } from "../../controller/admin/schoolSettings/studentReport.js";
const router = Router();

// here is the all routes for the students

router.get('/FetchStudents', getAllStudents) // route for the get all students

router.post('/students/addStudents', addNewStudent) // route for the

router.put('/students/editStudent', editStudent) // route for the edit student

// here is the all routes for the students Reports

router.post('/AddReports', addReport); // Route to add a new report

router.delete('/reports/:reportId', deleteReport); // Route to delete an existing report by ID

router.put('/reports/:reportId', editReport);// Route to edit an existing report by ID

// here is the all routes for the students attendence

router.get('/attendance/:moduleId/:batchId', getStudentsByModuleForAttendance);

router.get('/attendance/batch/:batchId/students', getStudentsByBatchForAttendance);// Route to get students by batch for attendance

router.post('/attendance', recordAttendance);// Route to record attendance

router.get('/attendance/student/:studentId', getAttendanceByStudent);// Route to get attendance records by student ID

router.get('/attendance/batch/:batchId/modules', getModulesByBatchForAttendance);// Define the route to get modules by batch for attendance

router.get('/attendance/module/:moduleId', getAttendanceByModule);// Route to get attendance records by module ID

router.put('/attendance/:id', updateAttendance);// Route to update attendance

router.delete('/attendance/:id', deleteAttendance);// Route to delete attendance

export default router;
  import mongoose from "mongoose";

  const courseSchema = new mongoose.Schema({
    course: {
      type: String,
      required: true,
    },
    categoryId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "category", 
      required: true,
    },
    moduleId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseModule",
      required: true,
  }],
  status: {
    type: String,
    required: true,
    default: 'active',
    enum: ['active', 'inactive'] 
  },
    code:{
      type:String,
    },
    type:{
      type:String
    },
    visibility:{
      type:String
    },
    duration: {
      type: String,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    applicationFees: {
      type: Number,
      required: true,
    },
  });

  const Course = mongoose.model("courses", courseSchema);

  export default Course;

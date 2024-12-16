import mongoose from 'mongoose';

const { Schema } = mongoose;

const batchSchema = new Schema({
    name: {
        type: String,

    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "students", 
        // required: true,
    }],
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses", 
    },
    batchCode: {
        type: String,
        // required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    startDate: {
        type: Date,
        // required: true,
    },
    endDate: {
        type: Date,
        // required: true,
    },
    intakeDate: {
        type: Date,
        // required: true,
    },
    module: [{
        moduleID: {
            type: Schema.Types.ObjectId, 
            ref: 'CourseModule',
   
          },
          status: {
            type: String,
            enum: ['completed', 'pending', 'notCompleted'],
            default: 'pending',
          },  
    }],
    classId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom", 
        // required: true,
    },

}, {
    timestamps: true
});

// Check if the model is already compiled before defining it
const Batch = mongoose.model('Batches', batchSchema);

export default Batch;

// models/schema/GroupModule.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const groupModuleSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    moduleId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseModule",
        required: true,
    }],
}, {
    timestamps: true
});

const group = mongoose.model('groupModule', groupModuleSchema);

export default group;


import mongoose from 'mongoose';

const { Schema } = mongoose;

const inventorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    serialNo:{
        type:String,
    },
    classId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom", 
        required: true,
    },
    quantity:{
        type:Number,
    },
    description:{
        type:String
    },
}, {
    timestamps: true
});

const inventory = mongoose.model('inventory', inventorySchema);

export default inventory;

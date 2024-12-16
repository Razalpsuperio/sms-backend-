import courseModule from "../../../models/schema/CourseModule.js";
import group from "../../../models/schema/GroupModule.js"



export const createGroupModule = async (req, res) => {
    try {
        console.log('create')
        const { name, moduleIds } = req.body; 
       

        const modules = await courseModule.find({ _id: { $in: moduleIds } });
        if (modules.length !== moduleIds.length) {
            return res.status(404).json({ message: "One or more modules not found" });
        }

        const groupModule = new group({
            name,
            moduleId: moduleIds
        });

        await groupModule.save();
        return res.status(201).json(groupModule);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};


export const deleteGroupModule = async (req, res) => {
    try {
        const { id } = req.params;

        const groupModule = await group.findByIdAndDelete(id);
        if (groupModule) {
            return res.status(200).json({ message: "Group module deleted successfully" });
        } else {
            return res.status(404).json({ message: "Group module not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};


export const editGroupModule = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, moduleIds } = req.body;

        const groupModule = await group.findById(id);
        if (!groupModule) {
            return res.status(404).json({ message: "Group module not found" });
        }

        if (moduleIds) {
            const modules = await courseModule.find({ _id: { $in: moduleIds } });
            if (modules.length !== moduleIds.length) {
                return res.status(404).json({ message: "One or more modules not found" });
            }
            groupModule.moduleId = moduleIds;
        }
        if (name) {
            groupModule.name = name;
        }

        await groupModule.save();
        return res.status(200).json(groupModule);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

export const getGroupModules = async (req, res) => {
    try {
        const groupModules = await group.find().populate('moduleId');
        console.log(groupModules)
        return res.status(200).json(groupModules);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

export const addModuleIdToGroupModule = async (req, res) => {
    try {
        const { id } = req.params; // Group module ID
        const { moduleId } = req.body; // Module ID to add

        const groupModule = await group.findById(id);
        if (!groupModule) {
            return res.status(404).json({ message: "Group module not found" });
        }

        const module = await courseModule.findById(moduleId);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        if (!groupModule.moduleId.includes(moduleId)) {
            groupModule.moduleId.push(moduleId);
            await groupModule.save();
            return res.status(200).json(groupModule);
        } else {
            return res.status(400).json({ message: "Module ID already exists in group module" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

export const deleteModuleIdFromGroupModule = async (req, res) => {
    try {
        const { id } = req.params; // Group module ID
        const { moduleId } = req.body; // Module ID to delete

        const groupModule = await group.findById(id);
        if (!groupModule) {
            return res.status(404).json({ message: "Group module not found" });
        }

        const moduleIndex = groupModule.moduleId.indexOf(moduleId);
        if (moduleIndex > -1) {
            groupModule.moduleId.splice(moduleIndex, 1);
            await groupModule.save();
            return res.status(200).json(groupModule);
        } else {
            return res.status(404).json({ message: "Module ID not found in group module" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

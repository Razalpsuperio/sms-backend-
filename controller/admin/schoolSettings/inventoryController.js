import Inventory from "../../../models/schema/Inventory.js";
import Classroom from "../../../models/schema/classroom.js ";

// Function to get all inventory items
export const getAllInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find({}).populate('classId');
    res.status(200).json({ success: true, data: inventoryItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Function to add a new inventory item
export const addNewInventoryItem = async (req, res) => {
  try {
    const { name, serialNo, classId, quantity, description } = req.body;
    
    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    const newInventoryItem = new Inventory({
      name,
      serialNo,
      classId,
      quantity,
      description,
    });

    const savedInventoryItem = await newInventoryItem.save();
    res.status(201).json(savedInventoryItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Function to update an inventory item
export const updateInventoryItem = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const { name, serialNo, classId, quantity, description } = req.body;

    const updatedInventoryItem = await Inventory.findByIdAndUpdate(
      inventoryId,
      { name, serialNo, classId, quantity, description },
      { new: true, runValidators: true }
    );

    if (!updatedInventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(updatedInventoryItem);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Function to delete an inventory item
export const deleteInventoryItem = async (req, res) => {
  try {
    const { inventoryId } = req.params;

    const deletedInventoryItem = await Inventory.findByIdAndDelete(inventoryId);

    if (!deletedInventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json({ message: "Inventory item deleted successfully", deletedInventoryItem });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

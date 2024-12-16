import Batch from "../../../models/schema/Batch.js";
import Category from "../../../models/schema/Category.js";

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = new Category({
      name,
      description,
    });

    await category.save();

    return res
      .status(201)
      .json({ message: "Category added successfully", category });
  } catch (error) {
    console.error("Error adding category", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;


    const result = await Category.deleteOne({ _id: categoryId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting Category :", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Function to edit a lesson in a module
export const editCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.title;
    category.description = description || category.description;

    await category.save();

    return res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error editing category :", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchCategory = async (req, res) => {
     try {
  
     const category=await Category.find()
 
     if (category){
        return res.status(200).json({
          message: "Successfully fetched lessons",
          data: category,
        });
    }else{
        return res.status(404).json({
            message: "category Not Available",            
          });
    }
      
    } catch (error) {
      console.error("Error fetching lessons:", error.message);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };


  
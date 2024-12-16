export const getAllAssignments = async (req, res) => {
    try {
        console.log('getAllAssignments');
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export const getSMSAdminAuth = async (req, res) => {
    try {
        console.log('getSMSAdminAuth');
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
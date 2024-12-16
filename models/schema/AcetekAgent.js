import mongoose from "mongoose";

// Define sub-schema for referral details
const referralSchema = new mongoose.Schema({
    name: String,
    designation: String,
    contact: String,
    email: String,
});

const acetekStudentRecruitersSchema = new mongoose.Schema({
    // Section A
    POTA: {
        BT: String,
        NOTA: String,
        OA: String,
        BRCH: String,
        NOD: String,
        DCN: String,
        BA: String,
        DE: String,
        NOACP: String,
        APCN: String,
        APE: String,
        NOSEFSR: String,
        BW: String,
    },

    // Section B
    TR: {
        WOTAFS: String,
        LOCTRS: String,
        MSRLY: String,
        LMEICRL: String,
        LENIYRSF: String,
        NSRREILY: String,
        RTYRSF: String,
        REFERRAL1: referralSchema,
        REFERRAL2: referralSchema,
    },

    // Section C
    FASO: {
        WYOL: String,
        BDYOF: String,
        DYAHF: String,
        SERVISES: [String],
    },

    // Section D
    REP: {
        WAYIRAC: String,
        YPRTRAC: String,
    },

    // Section E
    PD: {
        YPNSBRAC: Number,
        DECLARATION: Boolean,
    },

    // Common fields
    NAME: String,
    SIGNATURE: String,
    DESIGNATION: String,
});

const AcetekStudentRecruiters = mongoose.model("AcetekStudentRecruiters", acetekStudentRecruitersSchema);

export default AcetekStudentRecruiters;

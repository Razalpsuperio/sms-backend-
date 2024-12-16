import mongoose from "mongoose";

const applicationStepsSchema = new mongoose.Schema({
    isBasicRegistration: Boolean,
    isBusinessOverview: Boolean,
    isBankAccountDetails: Boolean,
    isPanDetails: Boolean,
    isDocumentVerified: Boolean,
    isESignAgreement: Boolean,
    isOk: {
        type: Boolean,
        default: false,
    }
});

const applicantInformationSchema = new mongoose.Schema({
    name: String,
    designation: String,
    typeOfApplicant: String,
    nameOfBusiness: String,
    countryOfBusiness: String,
    yearsOfOperation: String,
    contactNumber: String,
    email: String,
    address: String,
    isOk: {
        type: Boolean,
        default: false,
    }
});

const studentRecruitmentSchema = new mongoose.Schema({
    proposedRegionsToRecruitStudents: Array,
    proposedRegionsToRepresentStudents: Array,
    proposedNumberOfStudentsToBeRecruited: Number,
    isOk: {
        type: Boolean,
        default: false,
    }
})

const businessReferenceSchema = new mongoose.Schema({
    referee1: {
        name: String,
        designation: String,
        nameOfInstitute: String,
        email: String,
        contactNumber: String,
        isOk: {
            type: Boolean,
            default: false,
        }
    },
    referee2: {
        name: String,
        designation: String,
        nameOfInstitute: String,
        email: String,
        contactNumber: String,
        isOk: {
            type: Boolean,
            default: false,
        }
    }
})

const supportingDocumentsSchema = new mongoose.Schema({
    applicationAsCompany: {
        companyRegistrationCertificate: String,
        companyProfile: String,
        PhotoOfOfficePremisesExternalView: String,
        PhotoOfOfficePremisesInternalView: String,
        marketingCollateralsCopy: String,
        marketingPlanForAvis: String,
        isOk: {
            type: Boolean,
            default: false,
        }
    },
    applicationAsIndividual: {
        tradeLicenseOrNationalID: String,
        CV: String,
        PhotoOfOfficePremisesInternalView: String,
        PhotoOfOfficePremisesExternalView: String,
        marketingCollateralsCopy: String,
        marketingPlanForAvis: String,
        isOk: {
            type: Boolean,
            default: false,
        }
    }
})

const businessInformationSchema = new mongoose.Schema({
    NumberOfEmployees: Number,
    officeLocation: String,
    ListOfCountries: Array,
    majorEducationInstitute: Array,
    numberOfStudentsInLastYear: Number,
    listOfInStituteInMauritius: Array,
    isOk: {
        type: Boolean,
        default: false,
    }
})

const agentApplicationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        status: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            default: "agents",
        },
        isApproved: {
            type: Boolean,
        },
        representatives: [
            {
                type: String,
                ref: "representatives",
            },
        ],
        collegeId: [
            {
                type: String,
                ref: "college",
            },
        ],
        courseCommission: [
            {
                courseId: String,
                course: String,
                courseFee: Number,
                commission: Number,
            }
        ],
        commissionEarned: {
            type: Number,
            default: 0
        },
        commissionPending: {
            type: Number,
            default: 0
        },
        students: [
            {
                type: String,
                ref: "students",
            },
        ],
        address: {
            state: {
                type: String,
            },
            country: {
                type: String,
            },
        },
        applicantInformation: applicantInformationSchema,
        businessInformation: businessInformationSchema,
        studentRecruitment: studentRecruitmentSchema,
        businessReference: businessReferenceSchema,
        supportingDocuments: supportingDocumentsSchema,
        applicationStepsSchema: applicationStepsSchema
    },
    {
        timestamps: true,
    }
);

const AgentApplication = mongoose.model("agentapplication", agentApplicationSchema);

export default AgentApplication;

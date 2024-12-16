import mongoose from "mongoose";

const applicationStepsSchema = new mongoose.Schema({
  isBasicRegistration: Boolean,
  isApplicantInformation: Boolean,
  isStudentRecruitment: Boolean,
  isBusinessReference: Boolean,
  isBusinessInformation: Boolean,
  isRefereeOne: Boolean,
  isRefereeTwo: Boolean,
  isSupportingDocumentsOne: Boolean,
  isSupportingDocumentsTwo: Boolean,
  isESignAgreement: Boolean,
  isApproved: {
    type: Boolean,
    default: true,
  },
  responseMessage: {
    type: String,
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
  isApproved: {
    type: Boolean,
    default: false,
  },
  isRejected: {
    type: Boolean,
    default: false,
  },
  responseMessage: {
    type: String,
  }
});

const studentRecruitmentSchema = new mongoose.Schema({
  proposedRegionsToRecruitStudents: Array,
  proposedRegionsToRepresentStudents: Array,
  proposedNumberOfStudentsToBeRecruited: Number,
  isApproved: {
    type: Boolean,
    default: false,
  },
  isRejected: {
    type: Boolean,
    default: false,
  },
  responseMessage: {
    type: String,
  }
})

const businessReferenceSchema = new mongoose.Schema({
  referee1: {
    name: String,
    designation: String,
    nameOfInstitute: String,
    email: String,
    contactNumber: String,
  },
  referee2: {
    name: String,
    designation: String,
    nameOfInstitute: String,
    email: String,
    contactNumber: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isRejected: {
    type: Boolean,
    default: false,
  },
  responseMessage: {
    type: String,
  }
})

const supportingDocumentsSchema = new mongoose.Schema({
  applicationAsCompany: {
    companyRegistrationCertificate: {
      fileName: {
        type: String,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isRejected: {
        type: Boolean,
        default: false,
      },
      responseMessage: {
        type: String,
      }
    },
    companyProfile: {
      fileName: {
        type: String,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isRejected: {
        type: Boolean,
        default: false,
      },
      responseMessage: {
        type: String,
      }
    },
    PhotoOfOfficePremisesExternalView: {
      fileName: {
        type: String,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isRejected: {
        type: Boolean,
        default: false,
      },
      responseMessage: {
        type: String,
      }
    },
    PhotoOfOfficePremisesInternalView: {
      fileName: {
        type: String,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isRejected: {
        type: Boolean,
        default: false,
      },
      responseMessage: {
        type: String,
      }
    },
    marketingCollateralsCopy: {
      fileName: {
        type: String,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isRejected: {
        type: Boolean,
        default: false,
      },
      responseMessage: {
        type: String,
      }
    },
    marketingPlanForAvis: {
      fileName: {
        type: String,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isRejected: {
        type: Boolean,
        default: false,
      },
      responseMessage: {
        type: String,
      }
    },
  },
  applicationAsIndividual: {
    tradeLicenseOrNationalID: {
      fileName: {
        type: String,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isRejected: {
        type: Boolean,
        default: false,
      },
      responseMessage: {
        type: String,
      }
    },
    CV: {
      fileName: {
        type: String,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isRejected: {
        type: Boolean,
        default: false,
      },
      responseMessage: {
        type: String,
      }
    },
    photoOfOfficePremisesExternalIndividual: {
      fileName: {
        type: String,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isRejected: {
        type: Boolean,
        default: false,
      },
      responseMessage: {
        type: String,
      }
    },
    photoOfOfficePremisesInternalIndividual: {
      fileName: {
        type: String,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isRejected: {
        type: Boolean,
        default: false,
      },
      responseMessage: {
        type: String,
      }
    },
    marketingCollateralsCopyIndividual: {
      fileName: {
        type: String,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isRejected: {
        type: Boolean,
        default: false,
      },
      responseMessage: {
        type: String,
      }
    },
    marketingPlanForAvisIndividual: {
      fileName: {
        type: String,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isRejected: {
        type: Boolean,
        default: false,
      },
      responseMessage: {
        type: String,
      }
    },
  }
})

const businessInformationSchema = new mongoose.Schema({
  numberOfEmployees: Number,
  officeLocation: String,
  listOfCountries: Array,
  majorEducationInstitute: Array,
  numberOfStudentsInLastYear: Number,
  listOfInStituteInMauritius: Array,
  isApproved: {
    type: Boolean,
    default: false,
  },
  isRejected: {
    type: Boolean,
    default: false,
  },
  responseMessage: {
    type: String,
  }
})

const agentSchema = new mongoose.Schema(
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
      // default: false,
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
    agentCertificate: {
      type: String,
    },
    applicantInformation: applicantInformationSchema,
    businessInformation: businessInformationSchema,
    studentRecruitment: studentRecruitmentSchema,
    businessReference: businessReferenceSchema,
    supportingDocuments: supportingDocumentsSchema,
    applicationSteps: applicationStepsSchema
  },
  {
    timestamps: true,
  }
);

const Agent = mongoose.model("agent", agentSchema);

export default Agent;

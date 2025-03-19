import {
  IBioDataProps,
  IGetEmployeeEnrollmentRes,
  ITaxPensionsResponseProps,
} from "@/redux/api";

export const mapEmployeeEnrollmentToBioData = (
  enrollmentData: IGetEmployeeEnrollmentRes,
): IBioDataProps => {
  const { employeeBioData } = enrollmentData;
  return {
    staffId: "",
    basicInformation: {
      bioDataFormCompleted:
        employeeBioData.basicInformation.bioDataFormCompleted,
      userId: employeeBioData.basicInformation.userId,
      employeeId: employeeBioData.basicInformation.employeeId,
      enrollmentId: employeeBioData.basicInformation.enrollmentId,
      fullname: employeeBioData.basicInformation.fullname,
      firstname: employeeBioData.basicInformation.firstname,
      middlename: employeeBioData.basicInformation.middlename,
      lastname: employeeBioData.basicInformation.lastname,
      email: employeeBioData.basicInformation.email,
      profilePicture: employeeBioData.basicInformation.profilePicture,
      marriageCertificate: employeeBioData.basicInformation.marriageCertificate,
      passportUrl: employeeBioData.basicInformation.passportUrl,
      signatureUrl: employeeBioData.basicInformation.signatureUrl,
      address: employeeBioData.basicInformation.address,
      phoneNumber: employeeBioData.basicInformation.phoneNumber,
      alternatePhoneNumber:
        employeeBioData.basicInformation.alternatePhoneNumber,
      countryId: employeeBioData.basicInformation.countryId.toString(),
      country: employeeBioData.basicInformation.country,
      stateId: employeeBioData.basicInformation.stateId.toString(),
      state: employeeBioData.basicInformation.state,
      lgaId: employeeBioData.basicInformation.lgaId.toString(),
      lga: employeeBioData.basicInformation.lga,
      religionId: employeeBioData.basicInformation.religionId,
      religion: employeeBioData.basicInformation.religion,
      dateOfBirth: employeeBioData.basicInformation.dateOfBirth,
      genderId: employeeBioData.basicInformation.genderId,
      gender: employeeBioData.basicInformation.gender,
      maritalStatusId: employeeBioData.basicInformation.maritalStatusId,
      maritalStatus: employeeBioData.basicInformation.maritalStatus,
    },
    employeeDependent: employeeBioData.employeeDependent,
    employeeEmergencyContact: {
      lastname: employeeBioData.employeeEmergencyContact.lastname,
      firstname: employeeBioData.employeeEmergencyContact.firstname,
      middlename: employeeBioData.employeeEmergencyContact.middlename,
      address: employeeBioData.employeeEmergencyContact.address,
      email: employeeBioData.employeeEmergencyContact.email,
      phoneNumber: employeeBioData.employeeEmergencyContact.phoneNumber,
      tickedConsent: employeeBioData.employeeEmergencyContact.tickedConsent,
      completed: employeeBioData.employeeEmergencyContact.completed,
      relationshipId:
        employeeBioData.employeeEmergencyContact.relationshipId.toString(),
      relationship: employeeBioData.employeeEmergencyContact.relationship,
    },
    bankDetails: {
      accountNumber:
        employeeBioData.employeeBankDetails?.accountNumber?.toString?.(),
      accountName:
        employeeBioData.employeeBankDetails?.accountName?.toString?.(),
      bankId: {
        label: employeeBioData.employeeBankDetails?.accountName,
        value: employeeBioData.employeeBankDetails?.bankId?.toString?.(),
      },
    },
    employeeBankDetails: employeeBioData.employeeBankDetails,
    employeeNextOfKin: {
      lastname: employeeBioData.employeeNextOfKin.lastname,
      firstname: employeeBioData.employeeNextOfKin.firstname,
      middlename: employeeBioData.employeeNextOfKin.middlename,
      address: employeeBioData.employeeNextOfKin.address,
      email: employeeBioData.employeeNextOfKin.email,
      phoneNumber: employeeBioData.employeeNextOfKin.phoneNumber,
      tickedConsent: employeeBioData.employeeNextOfKin.tickedConsent,
      completed: employeeBioData.employeeNextOfKin.completed,
      relationshipId:
        employeeBioData.employeeNextOfKin.relationshipId.toString(),
      relationship: employeeBioData.employeeNextOfKin.relationship,
    },
    employeeEmploymenHistory: employeeBioData.employeeEmploymentHistory?.map(
      (history) => ({
        position: history.position,
        organisation: history.organisation,
        from: history.from,
        to: history.to,
      }),
    ),
    employeeAcademicBackground: employeeBioData.employeeAcademicBackground.map(
      (academic) => ({
        school: academic.school,
        major: academic.major,
        qualificationId: academic.qualificationId,
        qualification: academic.qualification,
        from: academic.from,
        to: academic.to,
        certificate: academic.certificate,
      }),
    ),
    employeeProfessionaQualification:
      employeeBioData.employeeProfessionaQualification.map((qual) => ({
        institution: qual.institution,
        qualification: qual.qualification,
        from: qual.from,
        to: qual.to,
        certificate: qual.certificate,
      })),
    employeeTrainingCertificate:
      employeeBioData?.employeeTrainingCertificate?.map((cert) => ({
        name: cert.name,
        institution: cert.institution,
        location: cert.location,
        to: cert.to,
        certificate: cert.certificate,
        employeeId: employeeBioData?.basicInformation?.employeeId,
      })),
    employeeTaxAndPension: {
      taxId: employeeBioData?.employeeTaxAndPension?.taxId || "",
      fundsAdministrator:
        (employeeBioData?.employeeTaxAndPension as ITaxPensionsResponseProps)
          ?.fundsAdministrator || "",
      fundsAdministratorId:
        (employeeBioData?.employeeTaxAndPension as ITaxPensionsResponseProps)
          ?.fundsAdministratorId || "",
      pensionPin: employeeBioData.employeeTaxAndPension.pensionPin || "",
      nhs:
        (employeeBioData?.employeeTaxAndPension as ITaxPensionsResponseProps)
          ?.nhs || "",
    },
  };
};


import * as yup from "yup";

const validationSchema = yup.object().shape({
  customerId: yup.string().required("Customer ID is required"),
  customerName: yup.string().required("Customer Name is required"),
  mobileNumber1: yup
    .string()
    .length(10, "Mobile Number must be exactly 10 digits")
    .matches(/^\d+$/, "Mobile Number must be digits only")
    .required("Mobile Number is required"),
  fatherhusname: yup.string().required("Father/Husband Name is required"),
  landmark: yup.string().required("Landmark is required"),
  address: yup.string().required("Address is required"),
  schema: yup.string().required("Schema is required"),
  percent: yup.string().required("Percent is required"),
  loanAmount: yup
    .number()
    .required("Loan Amount is required")
    .positive("Loan Amount must be positive"),
  interest: yup
    .number()
    .required("Interest is required")
    .positive("Interest must be positive"),
  date: yup.date().required("Date is required"),
  iw: yup.number().required("IW is required").positive("IW must be positive"),
  gw: yup.number().required("GW is required").positive("GW must be positive"),
  nw: yup.number().required("NW is required").positive("NW must be positive"),
  jewelList: yup
    .array()
    .of(yup.object().shape({}))
    .required("Jewel List is required"),
});

export default validationSchema;

/**
 * Employee seed rows — single source for master seed + department derivation.
 * `department` strings here must match what you want in the Department master table.
 */
export const employeeSeedRecords = [
  {
    name: "Arjun Mehta",
    employeeId: "EMP001",
    department: "Management",
    designation: "CEO",
    email: "arjun.mehta@company.com",
    phone: "9876543201",
    status: "active",
  },
  {
    name: "Priya Sharma",
    employeeId: "EMP002",
    department: "HR",
    designation: "HR Manager",
    email: "priya.sharma@company.com",
    phone: "9876543202",
    status: "active",
  },
  {
    name: "Rahul Desai",
    employeeId: "EMP003",
    department: "IT",
    designation: "IT Head",
    email: "rahul.desai@company.com",
    phone: "9876543203",
    status: "active",
  },
  {
    name: "Sneha Patel",
    employeeId: "EMP004",
    department: "Finance",
    designation: "Finance Manager",
    email: "sneha.patel@company.com",
    phone: "9876543204",
    status: "active",
  },
  {
    name: "Vikram Joshi",
    employeeId: "EMP005",
    department: "Operations",
    designation: "Operations Lead",
    email: "vikram.joshi@company.com",
    phone: "9876543205",
    status: "active",
  },
  {
    name: "Ananya Iyer",
    employeeId: "EMP006",
    department: "HR",
    designation: "HR Executive",
    email: "ananya.iyer@company.com",
    phone: "9876543206",
    status: "active",
  },
  {
    name: "Karan Malhotra",
    employeeId: "EMP007",
    department: "IT",
    designation: "Software Engineer",
    email: "karan.malhotra@company.com",
    phone: "9876543207",
    status: "active",
  },
  {
    name: "Divya Nair",
    employeeId: "EMP008",
    department: "Finance",
    designation: "Accountant",
    email: "divya.nair@company.com",
    phone: "9876543208",
    status: "active",
  },
  {
    name: "Rohan Gupta",
    employeeId: "EMP009",
    department: "Sales",
    designation: "Sales Manager",
    email: "rohan.gupta@company.com",
    phone: "9876543209",
    status: "active",
  },
  {
    name: "Meera Kulkarni",
    employeeId: "EMP010",
    department: "Admin",
    designation: "Admin Executive",
    email: "meera.kulkarni@company.com",
    phone: "9876543210",
    status: "active",
  },
  {
    name: "Aditya Bansal",
    employeeId: "EMP011",
    department: "IT",
    designation: "Network Engineer",
    email: "aditya.bansal@company.com",
    phone: "9876543211",
    status: "active",
  },
  {
    name: "Pooja Verma",
    employeeId: "EMP012",
    department: "Legal",
    designation: "Legal Advisor",
    email: "pooja.verma@company.com",
    phone: "9876543212",
    status: "active",
  },
  {
    name: "Sanjay Rao",
    employeeId: "EMP013",
    department: "Operations",
    designation: "Warehouse Supervisor",
    email: "sanjay.rao@company.com",
    phone: "9876543213",
    status: "active",
  },
  {
    name: "Kavita Singh",
    employeeId: "EMP014",
    department: "Management",
    designation: "Director",
    email: "kavita.singh@company.com",
    phone: "9876543214",
    status: "active",
  },
  {
    name: "Nikhil Choudhary",
    employeeId: "EMP015",
    department: "Sales",
    designation: "Business Dev Executive",
    email: "nikhil.choudhary@company.com",
    phone: "9876543215",
    status: "active",
  },
];

/** Unique `department` values from employee seed, sorted for stable output */
export const getDepartmentNamesFromEmployeeSeed =
  function getDepartmentNamesFromEmployeeSeed() {
    return [...new Set(employeeSeedRecords.map((row) => row.department))].sort(
      (a, b) => a.localeCompare(b),
    );
  };

export default { employeeSeedRecords, getDepartmentNamesFromEmployeeSeed };

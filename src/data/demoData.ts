// Comprehensive demo data for the entire application

// Demo Schools
export const demoSchools = [
  {
    id: "demo-school-1",
    kc_no: "AHM-001",
    school_name: "St. Xavier's High School",
    principal_name: "Dr. Ramesh Kumar",
    contact_number: "9876543210",
    email: "xavier@school.edu",
    kendra_name: "Ahmedabad Karuna Kendra",
    chapter_id: "chapter-1",
    status: "approved"
  },
  {
    id: "demo-school-2",
    kc_no: "PUN-002",
    school_name: "Delhi Public School",
    principal_name: "Mrs. Sunita Sharma",
    contact_number: "9876543211",
    email: "dps@school.edu",
    kendra_name: "Pune Karuna Kendra",
    chapter_id: "chapter-2",
    status: "approved"
  },
  {
    id: "demo-school-3",
    kc_no: "MUM-003",
    school_name: "Campion School",
    principal_name: "Fr. Thomas D'Souza",
    contact_number: "9876543212",
    email: "campion@school.edu",
    kendra_name: "Mumbai Karuna Kendra",
    chapter_id: "chapter-3",
    status: "approved"
  },
  {
    id: "demo-school-4",
    kc_no: "BLR-004",
    school_name: "Bishop Cotton Boys School",
    principal_name: "Mr. John Abraham",
    contact_number: "9876543213",
    email: "bishopscotton@school.edu",
    kendra_name: "Bangalore Karuna Kendra",
    chapter_id: "chapter-4",
    status: "approved"
  },
  {
    id: "demo-school-5",
    kc_no: "CHN-005",
    school_name: "Kendriya Vidyalaya",
    principal_name: "Mrs. Lakshmi Narayanan",
    contact_number: "9876543214",
    email: "kv@school.edu",
    kendra_name: "Chennai Karuna Kendra",
    chapter_id: "chapter-5",
    status: "approved"
  },
  {
    id: "demo-school-6",
    kc_no: "HYD-006",
    school_name: "GITAM Public School",
    principal_name: "Dr. Venkat Reddy",
    contact_number: "9876543215",
    email: "gitam@school.edu",
    kendra_name: "Hyderabad Karuna Kendra",
    chapter_id: "chapter-6",
    status: "approved"
  }
];

// Demo Students
export const demoStudents = [
  {
    id: "1",
    name: "Aarav Sharma",
    roll_no: "2024001",
    school: "St. Xavier's High School",
    kc_no: "AHM-001",
    email: "aarav.sharma@student.edu",
    mobile: "+91 98765 00001",
    exams_taken: 3,
    rank: 15,
    certificates: 3
  },
  {
    id: "2",
    name: "Diya Patel",
    roll_no: "2024002",
    school: "Delhi Public School",
    kc_no: "PUN-002",
    email: "diya.patel@student.edu",
    mobile: "+91 98765 00002",
    exams_taken: 3,
    rank: 8,
    certificates: 3
  },
  {
    id: "3",
    name: "Arjun Reddy",
    roll_no: "2024003",
    school: "Kendriya Vidyalaya",
    kc_no: "CHN-005",
    email: "arjun.reddy@student.edu",
    mobile: "+91 98765 00003",
    exams_taken: 2,
    rank: 45,
    certificates: 2
  },
  {
    id: "4",
    name: "Ananya Deshmukh",
    roll_no: "2024004",
    school: "Bishops School",
    kc_no: "BLR-004",
    email: "ananya.d@student.edu",
    mobile: "+91 98765 00004",
    exams_taken: 3,
    rank: 3,
    certificates: 3
  },
  {
    id: "5",
    name: "Rohan Mehta",
    roll_no: "2024005",
    school: "Campion School",
    kc_no: "MUM-003",
    email: "rohan.mehta@student.edu",
    mobile: "+91 98765 00005",
    exams_taken: 3,
    rank: 1,
    certificates: 3
  },
  {
    id: "6",
    name: "Priya Singh",
    roll_no: "2024006",
    school: "Ryan International School",
    kc_no: "HYD-006",
    email: "priya.singh@student.edu",
    mobile: "+91 98765 00006",
    exams_taken: 2,
    rank: 22,
    certificates: 2
  }
];

// Demo Submissions
export const demoSubmissions = [
  {
    id: "sub-1",
    event_id: "demo-1",
    school_id: "demo-school-1",
    status: "approved",
    score: 92,
    submitted_at: "2024-12-05T10:30:00Z",
    created_at: "2024-12-05T10:30:00Z",
    admin_comments: "Excellent submission with great documentation",
    schools: {
      school_name: "St. Xavier's High School",
      kc_no: "AHM-001",
      kendra_name: "Ahmedabad Karuna Kendra"
    },
    events: {
      title: "Annual Tree Plantation Drive 2024"
    },
    teachers: {
      name: "Mrs. Priya Sharma"
    }
  },
  {
    id: "sub-2",
    event_id: "demo-2",
    school_id: "demo-school-2",
    status: "pending",
    score: null,
    submitted_at: "2024-12-06T14:15:00Z",
    created_at: "2024-12-06T14:15:00Z",
    admin_comments: null,
    schools: {
      school_name: "Delhi Public School",
      kc_no: "PUN-002",
      kendra_name: "Pune Karuna Kendra"
    },
    events: {
      title: "Inter-School Essay Competition"
    },
    teachers: {
      name: "Mr. Rajesh Kumar"
    }
  },
  {
    id: "sub-3",
    event_id: "demo-3",
    school_id: "demo-school-3",
    status: "approved",
    score: 88,
    submitted_at: "2024-12-04T09:00:00Z",
    created_at: "2024-12-04T09:00:00Z",
    admin_comments: "Good effort, well organized event",
    schools: {
      school_name: "Campion School",
      kc_no: "MUM-003",
      kendra_name: "Mumbai Karuna Kendra"
    },
    events: {
      title: "Karuna Week Celebration"
    },
    teachers: {
      name: "Ms. Anjali Verma"
    }
  },
  {
    id: "sub-4",
    event_id: "demo-1",
    school_id: "demo-school-4",
    status: "rejected",
    score: null,
    submitted_at: "2024-12-03T16:45:00Z",
    created_at: "2024-12-03T16:45:00Z",
    admin_comments: "Please resubmit with proper documentation and photos",
    schools: {
      school_name: "Bishop Cotton Boys School",
      kc_no: "BLR-004",
      kendra_name: "Bangalore Karuna Kendra"
    },
    events: {
      title: "Annual Tree Plantation Drive 2024"
    },
    teachers: {
      name: "Dr. Suresh Menon"
    }
  },
  {
    id: "sub-5",
    event_id: "demo-4",
    school_id: "demo-school-5",
    status: "pending",
    score: null,
    submitted_at: "2024-12-07T11:20:00Z",
    created_at: "2024-12-07T11:20:00Z",
    admin_comments: null,
    schools: {
      school_name: "Kendriya Vidyalaya",
      kc_no: "CHN-005",
      kendra_name: "Chennai Karuna Kendra"
    },
    events: {
      title: "Animal Welfare Awareness Program"
    },
    teachers: {
      name: "Mrs. Padma Lakshmi"
    }
  },
  {
    id: "sub-6",
    event_id: "demo-2",
    school_id: "demo-school-6",
    status: "approved",
    score: 95,
    submitted_at: "2024-12-02T08:30:00Z",
    created_at: "2024-12-02T08:30:00Z",
    admin_comments: "Outstanding work! Featured in newsletter",
    schools: {
      school_name: "GITAM Public School",
      kc_no: "HYD-006",
      kendra_name: "Hyderabad Karuna Kendra"
    },
    events: {
      title: "Inter-School Essay Competition"
    },
    teachers: {
      name: "Mr. Venkata Rao"
    }
  }
];

// Demo Donations
export const demoDonations = [
  {
    id: "don-1",
    amount: 50000,
    donation_type: "education",
    payment_method: "upi",
    status: "completed",
    receipt_sent: true,
    donation_date: "2024-12-01T10:00:00Z",
    is_recurring: false,
    donors: {
      name: "Rajesh Gupta",
      email: "rajesh.gupta@email.com"
    }
  },
  {
    id: "don-2",
    amount: 25000,
    donation_type: "general",
    payment_method: "card",
    status: "completed",
    receipt_sent: true,
    donation_date: "2024-11-28T14:30:00Z",
    is_recurring: true,
    donors: {
      name: "Sunita Mehta",
      email: "sunita.mehta@email.com"
    }
  },
  {
    id: "don-3",
    amount: 100000,
    donation_type: "infrastructure",
    payment_method: "bank_transfer",
    status: "completed",
    receipt_sent: false,
    donation_date: "2024-11-25T09:15:00Z",
    is_recurring: false,
    donors: {
      name: "ABC Corporation",
      email: "csr@abccorp.com"
    }
  },
  {
    id: "don-4",
    amount: 15000,
    donation_type: "health",
    payment_method: "cash",
    status: "completed",
    receipt_sent: true,
    donation_date: "2024-11-20T16:00:00Z",
    is_recurring: false,
    donors: {
      name: "Dr. Anil Sharma",
      email: "dr.anil@hospital.com"
    }
  },
  {
    id: "don-5",
    amount: 75000,
    donation_type: "education",
    payment_method: "upi",
    status: "completed",
    receipt_sent: true,
    donation_date: "2024-11-15T11:45:00Z",
    is_recurring: true,
    donors: {
      name: "Priya Foundation",
      email: "donate@priyafoundation.org"
    }
  },
  {
    id: "don-6",
    amount: 10000,
    donation_type: "general",
    payment_method: "cash",
    status: "completed",
    receipt_sent: false,
    donation_date: "2024-11-10T13:20:00Z",
    is_recurring: false,
    donors: {
      name: "Anonymous Donor",
      email: "anonymous@email.com"
    }
  }
];

// Demo Leaderboard
export const demoLeaderboard = [
  {
    school_id: "demo-school-5",
    school_name: "Campion School",
    kc_no: "MUM-003",
    kendra_name: "Mumbai Karuna Kendra",
    total_score: 475,
    submissions_count: 5,
    average_score: 95,
    approved_submissions: 5
  },
  {
    school_id: "demo-school-1",
    school_name: "St. Xavier's High School",
    kc_no: "AHM-001",
    kendra_name: "Ahmedabad Karuna Kendra",
    total_score: 368,
    submissions_count: 4,
    average_score: 92,
    approved_submissions: 4
  },
  {
    school_id: "demo-school-6",
    school_name: "GITAM Public School",
    kc_no: "HYD-006",
    kendra_name: "Hyderabad Karuna Kendra",
    total_score: 270,
    submissions_count: 3,
    average_score: 90,
    approved_submissions: 3
  },
  {
    school_id: "demo-school-2",
    school_name: "Delhi Public School",
    kc_no: "PUN-002",
    kendra_name: "Pune Karuna Kendra",
    total_score: 352,
    submissions_count: 4,
    average_score: 88,
    approved_submissions: 4
  },
  {
    school_id: "demo-school-3",
    school_name: "Bishop Cotton Boys School",
    kc_no: "BLR-004",
    kendra_name: "Bangalore Karuna Kendra",
    total_score: 255,
    submissions_count: 3,
    average_score: 85,
    approved_submissions: 3
  },
  {
    school_id: "demo-school-4",
    school_name: "Kendriya Vidyalaya",
    kc_no: "CHN-005",
    kendra_name: "Chennai Karuna Kendra",
    total_score: 162,
    submissions_count: 2,
    average_score: 81,
    approved_submissions: 2
  }
];

// Demo Stats
export const demoStats = {
  totalSchools: 2567,
  totalStudents: 12450,
  activeEvents: 24,
  totalDonations: 520000,
  totalSubmissions: 3245,
  totalChapters: 48,
  submissionRate: 89,
  certificatesIssued: 245,
  reportsGenerated: 1245
};

// Demo Chapters
export const demoChapters = [
  "Ahmedabad Karuna Kendra",
  "Pune Karuna Kendra",
  "Mumbai Karuna Kendra",
  "Bangalore Karuna Kendra",
  "Chennai Karuna Kendra",
  "Hyderabad Karuna Kendra",
  "Delhi Karuna Kendra",
  "Kolkata Karuna Kendra"
];

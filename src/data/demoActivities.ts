export interface DemoActivity {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  thumbnail_url: string;
  banner_url: string;
  status: string;
  attachments: { name: string; url: string }[];
}

export const demoActivities: DemoActivity[] = [
  {
    id: "demo-1",
    title: "Annual Tree Plantation Drive 2024",
    description: "Join us for the annual tree plantation drive where students will plant saplings in their school premises and nearby areas. This initiative aims to create awareness about environmental conservation and encourage students to take responsibility for a greener future. Each participating school should plant at least 50 saplings and document the process with photographs and videos.",
    location: "School Premises",
    start_date: "2024-12-01T00:00:00Z",
    end_date: "2024-12-15T00:00:00Z",
    thumbnail_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=400&fit=crop",
    status: "active",
    attachments: [
      { name: "Plantation Guidelines.pdf", url: "#" },
      { name: "Sapling List.xlsx", url: "#" }
    ]
  },
  {
    id: "demo-2",
    title: "Inter-School Essay Competition",
    description: "An inter-school essay writing competition on the topic 'Compassion in Action: Building a Caring Society'. Students from classes 8-12 can participate. Essays should be 500-800 words and submitted in English or regional languages. Top 3 winners from each school will be awarded certificates and the best essays will be published in our annual magazine.",
    location: "Online Submission",
    start_date: "2024-12-10T00:00:00Z",
    end_date: "2024-12-25T00:00:00Z",
    thumbnail_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=400&fit=crop",
    status: "active",
    attachments: [
      { name: "Competition Rules.pdf", url: "#" }
    ]
  },
  {
    id: "demo-3",
    title: "Karuna Week Celebration",
    description: "A week-long celebration focusing on values of compassion, kindness, and community service. Activities include morning assemblies with value-based themes, classroom discussions, art competitions, and community outreach programs. Schools are encouraged to invite local community leaders and organize awareness campaigns.",
    location: "School Campus",
    start_date: "2024-12-20T00:00:00Z",
    end_date: "2024-12-27T00:00:00Z",
    thumbnail_url: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&h=300&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1200&h=400&fit=crop",
    status: "active",
    attachments: []
  },
  {
    id: "demo-4",
    title: "Animal Welfare Awareness Program",
    description: "An educational program to teach students about animal welfare and responsible pet ownership. The program includes presentations, interactive sessions with veterinarians, and a poster-making competition. Schools should organize visits to local animal shelters and document their experience.",
    location: "School Auditorium",
    start_date: "2025-01-05T00:00:00Z",
    end_date: "2025-01-12T00:00:00Z",
    thumbnail_url: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&h=400&fit=crop",
    status: "active",
    attachments: [
      { name: "Program Schedule.pdf", url: "#" },
      { name: "Poster Guidelines.pdf", url: "#" }
    ]
  },
  {
    id: "demo-5",
    title: "Youth Leadership Summit 2025",
    description: "A two-day summit bringing together student leaders from Karuna Clubs across the region. The summit will feature workshops on leadership skills, team building activities, and sessions by inspiring speakers. Selected students will present their school's best practices and initiatives.",
    location: "Karuna International Center, Bangalore",
    start_date: "2025-01-20T00:00:00Z",
    end_date: "2025-01-21T00:00:00Z",
    thumbnail_url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=400&fit=crop",
    status: "upcoming",
    attachments: [
      { name: "Summit Agenda.pdf", url: "#" },
      { name: "Registration Form.docx", url: "#" }
    ]
  },
  {
    id: "demo-6",
    title: "Community Service Day",
    description: "A dedicated day for students to engage in community service activities. Schools can organize visits to old age homes, orphanages, or conduct cleanliness drives in their neighborhoods. This activity emphasizes the importance of giving back to the community and developing empathy.",
    location: "Local Community",
    start_date: "2025-02-01T00:00:00Z",
    end_date: "2025-02-01T00:00:00Z",
    thumbnail_url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=400&fit=crop",
    status: "upcoming",
    attachments: []
  }
];

export const getDemoActivity = (id: string): DemoActivity | undefined => {
  return demoActivities.find(activity => activity.id === id);
};

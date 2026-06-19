export interface Problem {
  id: string;
  title: string;
  category: "bureaucracy" | "broken-systems" | "inefficiency" | "community" | "opportunity";
  description: string;
  isBurning: boolean;
  extinguishVotes: number;
  reporter: string;
  createdAt: string;
}

export interface Initiative {
  id: string;
  title: string;
  category: "Community Projects" | "Startups" | "Local Initiatives" | "Events" | "Volunteering" | "Innovation Challenges";
  description: string;
  impactScore: number;
  creator: string;
  githubUrl?: string;
  status: "building" | "launched" | "active";
}

export interface Member {
  id: string;
  name: string;
  role: string;
  quote: string;
  contribution: string;
  avatarUrl?: string;
  energyLevel: number; // For interactive neo-brutalist meters
}

export interface AJPEvent {
  id: string;
  title: string;
  category: "Hackathon" | "Sports" | "Community Drive" | "Workshop" | "Debate" | "Creator Meetup" | "Startup Night";
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  registeredCount: number;
}

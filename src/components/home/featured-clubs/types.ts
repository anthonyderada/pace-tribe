export interface ClubLabel {
  id: string;
  name: string;
}

export interface ClubLabelAssignment {
  id: string;
  label_id: string;
  club_labels: ClubLabel;
}

export interface ClubMember {
  id: string;
  user_id: string;
}

export interface Club {
  id: string;
  name: string;
  description?: string;
  location?: string;
  thumbnail_url?: string;
  club_members?: ClubMember[];
  club_label_assignments?: ClubLabelAssignment[];
}
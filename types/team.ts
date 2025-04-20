export interface Team {
  _id: string;
  name: string;
  logo: string;
  sport: {
    name: string;
    logo?: string;
    playerTypes?: string[];
  };
  address: {
    city: string;
    state: string;
    country: string;
    location: {
      coordinates: number[];
    };
  };
  establishedOn: Date;
  gender: string;
  description: string;
  [key: string]: any;
}

export type TeamMember = {
  _id: string;
  firstName: string;
  lastName: string;
  username?: string;
  headline: string;
  profilePic?: string;
};

export interface SuggestTeam {
  _id: string;
  name: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
  logo: {
    url: string;
  };
  [key: string]: any;
}


export type Social = {
  name: string
  href: string
}


export type Project = {
  number: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  variant: "dashboard" | "commerce" | "editorial";
};


export type Profile = {
  name: string;
  email: string;
  socials: Social[];
}

import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Avatar } from '@/components/ui/avatar';
import { MapPin, Globe, MessageSquare, Users } from 'lucide-react';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';

const About = () => {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    {
      name: "Andrew Nashaat",
      role: "MERN Stack developer",
      bio: "Front-end MERN stack developer with TechX",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      social: { github: "#", instagram: "#", linkedin: "#" },
    },
    {
      name: "Mohamed Samer",
      role: "MERN Stack developer",
      bio: "Front-end MERN stack developer",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      social: { github: "#", instagram: "#", linkedin: "#" },
    },
    {
      name: "Zeinab Abu EL-soud",
      role: "React front-end developer",
      bio: "React.js front-end developer",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      social: { github: "#", instagram: "#", linkedin: "#" }, 
    },
    {
      name: "Mariam Nabil",
      role: "MERN Stack developer",
      bio: "Front-end MERN stack developer",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      social: { github: "#", instagram: "#", linkedin: "#" },
    },
  ];

  return (
    <Layout>
      {/* Hero section */}
      <section className="relative">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div
          className="relative h-[50vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dHJhdmVsfHwwfHx8fDE1NzQ3MzMxMzE&ixlib=rb-4.0.3&q=80&w=1080)`,
          }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-20 w-full max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Polaris</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Inspiring adventures and connecting travelers since 2018
          </p>
        </div>
      </section>

      {/* Our story section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="prose prose-lg mx-auto">
            <p>
              Polaris began with a simple idea: to create a platform where
              travelers could find authentic inspiration and practical advice
              for their adventures. Founded in 2025 by InnoCrew team, our blog
              has grown into a thriving community of explorers, photographers,
              and storytellers.
            </p>
            <p>
              Our mission is to inspire meaningful travel experiences that go
              beyond tourist attractions. We believe in responsible tourism that
              respects local cultures and environments while creating authentic
              connections between travelers and the places they visit.
            </p>
            <p>
              What started as a personal blog has evolved into a team of
              passionate travelers who have collectively visited over 100
              countries across all seven continents. We pride ourselves on
              providing honest, practical, and inspiring content that helps our
              readers plan unforgettable journeys.
            </p>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-12 px-4 bg-muted">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center align-middle">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <Globe className="h-10 w-10 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold">100+</div>
              <div className="text-muted-foreground">Countries Explored</div>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <MapPin className="h-10 w-10 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold">500+</div>
              <div className="text-muted-foreground">Destinations</div>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <MessageSquare className="h-10 w-10 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold">1,000+</div>
              <div className="text-muted-foreground">Travel Stories</div>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <Users className="h-10 w-10 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold">500K+</div>
              <div className="text-muted-foreground">Monthly Readers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Meet The Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-lg border">
                <Avatar className="h-16 w-16">
                  <img src={member.avatar} alt={member.name} />
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-primary mb-1">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {member.bio}
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={member.social.github}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <FaGithub size={18} />
                    </a>
                    <a
                      href={member.social.instagram}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <FaInstagram size={18} />
                    </a>
                    <a
                      href={member.social.linkedin}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <FaLinkedin size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                Authentic Experiences
              </h3>
              <p className="text-muted-foreground">
                We believe in travel that goes beyond tourist attractions to
                create genuine connections with local cultures and communities.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                Responsible Tourism
              </h3>
              <p className="text-muted-foreground">
                We promote sustainable travel practices that respect local
                environments and benefit the communities we visit.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                Inclusive Adventure
              </h3>
              <p className="text-muted-foreground">
                We believe travel should be accessible to everyone and create
                content for travelers of all backgrounds, abilities, and
                budgets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

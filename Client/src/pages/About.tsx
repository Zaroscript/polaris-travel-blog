import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Globe, 
  MessageSquare, 
  Users, 
  Star, 
  Clock, 
  ChevronRight, 
  Trophy,
  Bookmark,
  Heart,
  Camera,
  Send
} from 'lucide-react';
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const About = () => {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    {
      name: "Andrew Nashaat",
      role: "Lead Developer",
      bio: "Full-stack developer with expertise in MERN stack and a passion for creating seamless travel experiences through technology.",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      social: { github: "#", instagram: "#", linkedin: "#", twitter: "#" },
    },
    {
      name: "Mohamed Samir",
      role: "Frontend Developer",
      bio: "Creative Frontend Developer with a focus on user experience and interactive interfaces that bring travel stories to life.",
      avatar: "https://randomuser.me/api/portraits/lego/2.jpg",
      social: { github: "#", instagram: "#", linkedin: "#", twitter: "#" },
    },
    {
      name: "Zeinab Abu EL-soud",
      role: "Frontend Developer",
      bio: "Creative Frontend Developer with a focus on user experience and interactive interfaces that bring travel stories to life.",
      avatar: "https://randomuser.me/api/portraits/lego/3.jpg",
      social: { github: "#", instagram: "#", linkedin: "#", twitter: "#" }, 
    },
    {
      name: "Mariam Nabil",
      role: "MERN Stack Developer",
      bio: "Creative MERN Stack Developer with a focus on building interactive and engaging travel experiences.",
      avatar: "https://randomuser.me/api/portraits/lego/4.jpg",
      social: { github: "#", instagram: "#", linkedin: "#", twitter: "#" },
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Toronto, Canada",
      quote: "Polaris completely transformed my European backpacking trip. Their off-the-beaten-path recommendations led me to experiences I never would have found elsewhere.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "David Chen",
      location: "Melbourne, Australia",
      quote: "As a solo traveler, I rely on authentic advice from real travelers. Polaris has become my go-to resource for planning adventures that feel genuine and meaningful.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Aisha Patel",
      location: "London, UK",
      quote: "The cultural insights on Polaris helped me connect more deeply with local communities during my travels through Southeast Asia. Truly invaluable guidance!",
      avatar: "https://randomuser.me/api/portraits/women/66.jpg"
    }
  ];

  const awards = [
    {
      year: "2025",
      title: "Outstanding Innovation Project - DEPI Awards",
      description: "Recognized for our innovative approach to travel content and social connectivity"
    },
    {
      year: "2025",
      title: "Best User Experience - Digital Projects Showcase",
      description: "Awarded for exceptional interface design and user-centered approach"
    },
    {
      year: "2025",
      title: "Rising Star in Travel Tech - StartHub Network",
      description: "Featured as one of the most promising digital platforms in the travel space"
    }
  ];

  const timelineEvents = [
    {
      year: "2025 - December",
      title: "First 10,000 Users Milestone",
      description: "Celebrated reaching our first major user milestone within months of launch"
    },
    {
      year: "2025 - November",
      title: "Mobile App Beta Launch",
      description: "Expanded our platform with a native mobile application for iOS and Android users"
    },
    {
      year: "2025 - September",
      title: "Community Features Release",
      description: "Launched interactive features allowing travelers to connect and share experiences"
    },
    {
      year: "2025 - July",
      title: "Official Public Launch",
      description: "Transformed our academic project into a full-fledged travel platform open to the public"
    },
    {
      year: "2025 - May",
      title: "DEPI Project Showcase",
      description: "Presented Polaris as our final project, receiving outstanding recognition from faculty and peers"
    },
    {
      year: "2025 - February",
      title: "Polaris Concept Development",
      description: "The initial concept was formulated as a DEPI final project focusing on revolutionizing travel content"
    }
  ];

  return (
    <Layout>
      {/* Hero section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <div
          className="relative h-[60vh] bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1920&auto=format&fit=crop)`,
          }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-20 w-full max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Polaris</h1>
          <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-8">
            Inspiring authentic adventures and connecting travelers across the globe
          </p>
          <Button className="bg-primary-foreground hover:bg-primary/90 text-primary hover:text-primary-foreground" size="lg">
            Explore Our Stories
          </Button>
        </div>
      </section>

      {/* Mission and Vision section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="shadow-md border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary" /> Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  To revolutionize the travel experience by merging the depth of blog content with the 
                  connectivity of social media, creating a platform where travelers can discover authentic 
                  destinations, connect with fellow adventurers, and share meaningful experiences that inspire 
                  global exploration.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Bookmark className="h-6 w-6 text-primary" /> Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  To become the world's most influential travel platform, transforming how people discover 
                  and experience destinations worldwide. We aspire to build a global community where authentic 
                  travel knowledge flows freely, empowering adventurers to create more meaningful connections 
                  with places and people across cultures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our story section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-center">Our Story</h2>
            <div className="w-20 h-1 bg-primary rounded mb-4"></div>
            <p className="text-muted-foreground text-lg text-center max-w-xl">
              From a classroom project to a travel revolution
            </p>
          </div>
          <div className="prose prose-lg mx-auto bg-background p-8 rounded-lg shadow-sm">
            <p>
              Polaris began as an ambitious final project for the DEPI program in early 2025. What started as an 
              academic assignment quickly evolved into a passion project with a clear mission: to create a 
              travel blog with the immersive, connecting power of social media, taking the traveler experience 
              to unprecedented heights.
            </p>
            <p>
              Our team recognized that traditional travel resources lacked the community 
              engagement and personalized recommendations that modern travelers craved. We envisioned a platform 
              where travelers could not only discover authentic destinations but also connect with like-minded 
              adventurers, share real-time experiences, and access tailored recommendations that mainstream 
              travel sites simply couldn't offer.
            </p>
            <p>
              With guidance from our exceptional supervisor, Eng. Basma Abdel Halim, we transformed our 
              classroom concept into a fully functional platform that combined the storytelling power of a blog 
              with the interactive features of social media. Her expertise and mentorship were invaluable in 
              shaping both our technical approach and our vision for Polaris's future impact.
            </p>
            <p>
              What began as a final project has quickly gained momentum as we continue to develop its features.
              We aspire to become the most influential travel platform in the digital landscape, redefining how 
              people discover, experience, and share their journeys around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <Card className="border-none shadow-md bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6">
                <Globe className="h-12 w-12 text-primary mx-auto mb-3" />
                <div className="text-4xl font-bold mb-1">100+</div>
                <div className="text-muted-foreground">Countries Explored</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-3" />
                <div className="text-4xl font-bold mb-1">500+</div>
                <div className="text-muted-foreground">Destinations</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6">
                <MessageSquare className="h-12 w-12 text-primary mx-auto mb-3" />
                <div className="text-4xl font-bold mb-1">1,000+</div>
                <div className="text-muted-foreground">Travel Stories</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                <div className="text-4xl font-bold mb-1">500K+</div>
                <div className="text-muted-foreground">Monthly Readers</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter section */}
      <section className="py-16 px-4 bg-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-pattern-dots"></div>
        </div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="bg-background p-8 md:p-12 rounded-xl shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Join Our Travel Community</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Subscribe to our newsletter for exclusive travel tips, destination guides, and special offers delivered straight to your inbox.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-md border border-input bg-background"
                />
              </div>
              <Button className="bg-primary-foreground hover:bg-primary/90 text-primary hover:text-primary-foreground" size="lg">
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
            <div className="text-center mt-4 text-sm text-muted-foreground">
              We respect your privacy and will never share your information.
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-3xl font-bold mb-2 text-center">Meet The Team</h2>
            <div className="w-20 h-1 bg-primary rounded mb-4"></div>
            <p className="text-muted-foreground text-lg text-center max-w-xl">
              The passionate travelers behind Polaris
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription className="text-primary">{member.role}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {member.bio}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 flex justify-start gap-3">
                  <a
                    href={member.social.github}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${member.name}'s GitHub`}
                  >
                    <FaGithub size={18} />
                  </a>
                  <a
                    href={member.social.instagram}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${member.name}'s Instagram`}
                  >
                    <FaInstagram size={18} />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <FaLinkedin size={18} />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${member.name}'s Twitter`}
                  >
                    <FaTwitter size={18} />
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Travelers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                <Avatar className="h-12 w-12 mb-4">
                  <img src={testimonial.avatar} alt={testimonial.name} />
                </Avatar>
                <h3 className="text-xl font-semibold mb-2">{testimonial.name}</h3>
                <p className="text-muted-foreground mb-4">{testimonial.location}</p>
                <p className="text-lg">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Awards & Recognition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {awards.map((award, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-lg border">
                <div className="bg-background p-4 rounded-lg shadow-sm">
                  <Trophy className="h-10 w-10 text-primary mx-auto mb-2" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{award.title}</h3>
                  <p className="text-primary mb-1">{award.year}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {award.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline section */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {timelineEvents.map((event, index) => (
              <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-muted-foreground mb-4">{event.year}</p>
                <p className="text-lg">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Thanks section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-center">Special Thanks</h2>
            <div className="w-20 h-1 bg-primary rounded mb-4"></div>
          </div>
          <Card className="shadow-md border-primary/20 max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-6">
              <div className="relative mx-auto mb-6 w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                  B
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Eng. Basma Abdel Halim</h3>
              <p className="text-primary mb-4">Project Supervisor</p>
              <p className="text-lg mb-4">
                Our heartfelt gratitude goes to Eng. Basma Abdel Halim for her exceptional guidance, 
                unwavering support, and valuable insights throughout the development of Polaris. 
                Her expertise and mentorship were instrumental in transforming our vision into reality.
              </p>
              <p className="italic text-muted-foreground">
                "A great mentor doesn't just teach; they inspire. We are forever grateful for the 
                inspiration and direction that made Polaris possible."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-3xl font-bold mb-2 text-center">Our Values</h2>
            <div className="w-20 h-1 bg-primary rounded mb-4"></div>
            <p className="text-muted-foreground text-lg text-center max-w-xl">
              The principles that guide our approach to travel
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-primary/10 hover:border-primary/30 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-0 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" /> Authentic Experiences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe in travel that goes beyond tourist attractions to
                  create genuine connections with local cultures and communities,
                  focusing on experiences that transform and enrich.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/10 hover:border-primary/30 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-0 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" /> Responsible Tourism
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We promote sustainable travel practices that respect local
                  environments and benefit the communities we visit, minimizing
                  our footprint while maximizing positive impact.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/10 hover:border-primary/30 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-0 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Inclusive Adventure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe travel should be accessible to everyone and create
                  content for travelers of all backgrounds, abilities, and
                  budgets, celebrating diversity in all forms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Explore With Us?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover amazing destinations, connect with fellow travelers, and start planning your next adventure today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/destinations">
            <Button className="bg-primary-foreground hover:bg-primary/90 text-primary hover:text-primary-foreground" size="lg">
              Browse Destinations
            </Button>
            </Link>
            <Link to="/blogs">
            <Button variant="outline" size="lg">
              View Latest Stories
            </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

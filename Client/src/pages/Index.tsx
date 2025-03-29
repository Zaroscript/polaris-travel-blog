
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/blogData';
import { destinations } from '@/data/destinations';
import BlogCard from '@/components/blog/BlogCard';
import DestinationCard from '@/components/destination/DestinationCard';
import { ArrowRight, ChevronRight } from 'lucide-react';

const Index = () => {
  const [featuredPosts, setFeaturedPosts] = useState(blogPosts.slice(0, 3));
  const [popularDestinations, setPopularDestinations] = useState(destinations.slice(0, 4));

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* Hero section */}
      <section className="relative">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div 
          className="relative h-[80vh] bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${destinations[0].image})` 
          }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-20 w-full max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Explore The World With Us</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing destinations, travel tips, and stories from adventurers around the globe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90"
              asChild
            >
              <Link to="/destinations">Explore Destinations</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20"
              asChild
            >
              <Link to="/blogs">Read Travel Stories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular destinations section */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Destinations</h2>
            <Link to="/destinations" className="flex items-center gap-1 text-primary hover:underline">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured blog posts section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Travel Stories</h2>
            <Link to="/blogs" className="flex items-center gap-1 text-primary hover:underline">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 px-4 bg-muted text-center">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Travel Community</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with fellow travelers, share your experiences, and stay updated with the latest travel tips and destinations.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
            <Link to="/social">
              Join Community
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

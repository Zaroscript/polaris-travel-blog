import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/blogData';
import BlogCard from '@/components/blog/BlogCard';
import DestinationCard from '@/components/destination/DestinationCard';
import { 
  ArrowRight, 
  ChevronRight, 
  MapPin, 
  Star, 
  ShoppingBag,
  Heart, 
  ChevronLeft, 
  Award,
  Compass,
  Clock,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDestinationsStore } from '@/store/useDestinationsStore';
import { DestinationSkeleton } from '@/components/skeletons/DestinationSkeleton';
import { Destination } from '@/types/destination';
import { Post as SocialPost } from '@/types/social';
import { getDestinationImageUrl, handleImageError } from '@/lib/imageUtils';

// Import BlogPost type 
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  category: string;
  tags: string[];
  likes: number;
  comments: Array<any>;
  gallery?: string[];
  featured?: boolean;
  readTime?: string;
}

// Extended destination type for UI display
interface DisplayDestination extends Destination {
  price?: number;
  duration?: number;
  groupSize?: number;
}

// Sample travel products data that will link to Amazon
const travelProducts = [
  {
    id: 1,
    name: "Osprey Ultralight Packing Cube Set",
    description: "Premium packing cubes for organized travel from the trusted Osprey brand",
    price: 39.95,
    rating: 4.8,
    reviewCount: 3584,
    image: "https://m.media-amazon.com/images/I/41sFuU9pbYL._AC_SY679_.jpg",
    amazonLink: "https://amzn.to/48IPSmy"
  },
  {
    id: 2,
    name: "3-in-1 Apple Travel Charging Station",
    description: "Compact foldable charging dock for iPhone, Apple Watch and AirPods",
    price: 29.99,
    rating: 4.6,
    reviewCount: 2965,
    image: "https://m.media-amazon.com/images/I/81UnaTCSLrL._AC_SX569_.jpg",
    amazonLink: "https://amzn.to/3OfY2ut"
  },
  {
    id: 3,
    name: "Master Lock Portable Travel Safe",
    description: "Secure your valuables anywhere with this lightweight portable safe",
    price: 22.54,
    rating: 4.5,
    reviewCount: 8742,
    image: "https://m.media-amazon.com/images/I/81VkinrNUdL._AC_SX522_.jpg",
    amazonLink: "https://www.amazon.com/gp/product/B005K6JQXQ/"
  },
  {
    id: 4,
    name: "TUBE Travel Pillow",
    description: "Innovative pillow you can stuff with clothes - perfect for light packers",
    price: 49.95,
    rating: 4.4,
    reviewCount: 1583,
    image: "https://m.media-amazon.com/images/I/61hEcmHuQIL._AC_SX522_.jpg",
    amazonLink: "https://amzn.to/3HvEzlM"
  },
  {
    id: 5,
    name: "Addalock Portable Door Lock",
    description: "Extra security for hotel rooms, Airbnbs, and hostels while traveling",
    price: 17.95,
    rating: 4.7,
    reviewCount: 5261,
    image: "https://m.media-amazon.com/images/I/71coaNix4cL._AC_SX522_.jpg",
    amazonLink: "https://www.amazon.com/gp/product/B00186URTY/"
  },
  {
    id: 6,
    name: "ZINZ Elastic Jacket Gripper Travel Strap",
    description: "Keep your jacket, pillow, and other items secured to your luggage",
    price: 13.99,
    rating: 4.6,
    reviewCount: 3876,
    image: "https://m.media-amazon.com/images/I/7165mIce61L._AC_SX466_.jpg",
    amazonLink: "https://amzn.to/3DIgmdd"
  }
];

// Default fallback image for destinations
const DEFAULT_DESTINATION_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80";

// Travel tips data
const travelTips = [
  {
    id: 1,
    title: "Pack Light, Travel Far",
    description: "Maximize your mobility by packing only essentials. Use packing cubes and multi-purpose clothing.",
    icon: <ShoppingBag className="h-6 w-6 text-primary" />,
  },
  {
    id: 2,
    title: "Research Local Customs",
    description: "Respect local traditions by learning basic phrases and cultural norms before you arrive.",
    icon: <Compass className="h-6 w-6 text-primary" />,
  },
  {
    id: 3,
    title: "Plan, But Stay Flexible",
    description: "Create an itinerary but leave room for spontaneity and unexpected discoveries.",
    icon: <Clock className="h-6 w-6 text-primary" />,
  },
  {
    id: 4,
    title: "Connect With Locals",
    description: "Engage with residents for authentic experiences and hidden gem recommendations.",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Paris, France",
    quote: "The Polaris travel guides helped me discover hidden gems in Paris that most tourists never see. Their local insights made my trip unforgettable!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Kyoto, Japan",
    quote: "I've used many travel blogs, but Polaris stands out with its detailed cultural insights and practical tips. Their Japan guide was essential for my trip.",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "Barcelona, Spain",
    quote: "Thanks to Polaris, I found the most authentic tapas bars and avoided tourist traps. Their recommendations made my Barcelona trip truly special.",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
  },
];

const Index = () => {
  // Convert blog posts to match the Post interface expected by BlogCard
  const [featuredPosts, setFeaturedPosts] = useState(
    blogPosts.slice(0, 3).map(post => ({
      _id: post.id.toString(),
      title: post.title,
      slug: post.title.toLowerCase().replace(/\s+/g, '-'), // Generate slug from title
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.image,
      author: {
        _id: `author-${post.id}`, // Generate author ID based on post ID
        fullName: post.author.name, // Map name to fullName
        profilePic: post.author.avatar // Map avatar to profilePic
      },
      category: post.category,
      tags: post.tags,
      createdAt: new Date().toISOString(),
      // Convert likes count to array of placeholder like objects
      likes: Array(post.likes || 0).fill(0).map((_, i) => ({
        _id: `like-${i}-${post.id}`,
        fullName: `User ${i}`,
        profilePic: ''
      })),
      // Convert comments to match the expected structure
      comments: (post.comments || []).map(comment => ({
        _id: comment.id?.toString() || `comment-${Math.random()}`,
        content: comment.text || "",
        author: {
          _id: comment.user?.name || "anonymous",
          fullName: comment.user?.name || "Anonymous User",
          profilePic: comment.user?.avatar || ""
        },
        likes: [],
        createdAt: comment.date || new Date().toISOString(),
        replies: []
      })),
      gallery: post.gallery || [],
      isSaved: false,
      isLiked: false
    }) as SocialPost)
  );
  
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [currentBackground, setCurrentBackground] = useState(0);
  const backgroundRef = useRef(null);
  const { 
    destinations, 
    isLoading, 
    fetchDestinations, 
    fetchPopularDestinations
  } = useDestinationsStore();

  useEffect(() => {
    // Fetch popular destinations using the store
    fetchPopularDestinations(6);

    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Cycle through backgrounds
    const interval = setInterval(() => {
      if (destinations.length > 0) {
        setCurrentBackground((prev) => 
          (prev + 1) % Math.min(3, destinations.length)
        );
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [fetchPopularDestinations, destinations.length]);

  // Function to handle Amazon product link clicks
  const handleProductClick = (productLink: string) => {
    window.open(productLink, '_blank');
  };

  return (
    <Layout>
      {/* Hero section with rotating backgrounds */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out" ref={backgroundRef}>
          {destinations.length > 0 ? (
            // If we have destinations, show up to 3 of them
            [0, 1, 2].map((index) => {
              // Check if we have a destination at this index
              if (index < destinations.length) {
                const destination = destinations[index];
                return (
                  <div
                    key={destination._id || index}
                    className={cn(
                      "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
                      currentBackground === index ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                      backgroundImage: `url(${getDestinationImageUrl(destination)})`,
                    }}
                  />
                );
              }
              return null;
            })
          ) : (
            // If no destinations, show fallback image
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${DEFAULT_DESTINATION_IMAGE})`,
              }}
            />
          )}
        </div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-20 w-full max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Explore The World's <span className="text-primary">Hidden Wonders</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light">
              Discover breathtaking destinations, authentic experiences, and travel insights 
              curated by passionate explorers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
                asChild
              >
                <Link to="/destinations">Explore Destinations</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 text-lg px-8 py-6"
                asChild
              >
                <Link to="/blogs">Read Travel Stories</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Statistics Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md z-20 py-6">
          <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-primary">50+</h3>
              <p className="text-sm md:text-base">Countries Covered</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-primary">1200+</h3>
              <p className="text-sm md:text-base">Destinations</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-primary">15K+</h3>
              <p className="text-sm md:text-base">Happy Travelers</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-primary">4.9</h3>
              <p className="text-sm md:text-base">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm">OUR MISSION</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Why Explorers Choose Polaris</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We're more than just a travel blog. We're a community of passionate travelers dedicated to authentic experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Expert Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our travel guides are written by experienced travelers and local experts who know each destination intimately.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Compass className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Authentic Experiences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We focus on authentic local experiences, hidden gems, and responsible travel practices.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Traveler Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join thousands of like-minded travelers sharing tips, stories, and inspiration for your next adventure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular destinations section with enhanced UI */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">TOP PICKS</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Popular Destinations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover breathtaking locations loved by our community of travelers
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((index) => (
                <DestinationSkeleton key={index} />
              ))}
            </div>
          ) : destinations.length > 0 ? (
            <>
              {/* Featured destination */}
              {destinations.length > 0 && (
                <div className="mb-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <DestinationCard 
                      destination={{
                        ...destinations[0],
                        price: 1299,
                        duration: 7,
                        groupSize: 12
                      } as DisplayDestination} 
                      variant="featured" 
                    />
                  </motion.div>
                </div>
              )}
              
              {/* Grid of other destinations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {destinations.slice(1, 4).map((destination) => (
                  <motion.div
                    key={destination._id}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DestinationCard 
                      destination={{
                        ...destination,
                        price: Math.floor(Math.random() * 500) + 800, // Random price between $800-$1300
                        duration: Math.floor(Math.random() * 5) + 3, // Random duration between 3-7 days
                        groupSize: Math.floor(Math.random() * 10) + 5 // Random group size between 5-15
                      } as DisplayDestination} 
                    />
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center mt-10">
                <Button variant="default" size="lg" className="bg-primary hover:bg-primary/90 mt-4" asChild>
                  <Link to="/destinations" className="group">
                    View All Destinations
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
              <p className="text-muted-foreground max-w-md">
                We're still exploring the world to bring you the best destinations.
                Check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Travel Tips & Advice Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30">EXPERT ADVICE</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Travel Tips & Insights</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Make the most of your adventures with our expert travel advice
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {travelTips.map((tip) => (
              <Card key={tip.id} className="border-none shadow-md hover:shadow-lg transition-all">
                <CardHeader className="pb-2">
                  <div className="mb-4">{tip.icon}</div>
                  <CardTitle>{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button variant="default" size="lg" className="mt-4" asChild>
              <Link to="/blogs" className="group">
                More Travel Tips
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured blog posts section with enhanced UI */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">INSPIRING STORIES</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Featured Travel Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Immerse yourself in captivating travel narratives from around the world
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <motion.div
                key={post._id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button variant="outline" size="lg" className="mt-4" asChild>
              <Link to="/blogs" className="group">
                Read More Stories
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* New Travel Products Section with Carousel */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30">RECOMMENDED GEAR</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Essential Travel Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quality gear and accessories to enhance your travel experience
            </p>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="mx-auto max-w-7xl"
          >
            <CarouselContent>
              {travelProducts.map((product) => (
                <CarouselItem key={product.id} className="basis-full md:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="p-1">
                    <Card className="group border border-border/40 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      <div className="relative aspect-square overflow-hidden bg-muted/20">
                        {/* Price Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <Badge className="bg-primary text-white font-semibold px-3 py-1.5 text-sm shadow-md">
                            ${product.price}
                          </Badge>
                        </div>
                        
                        {/* Image with zoom effect */}
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-white p-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="object-contain w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://placehold.co/600x400?text=Product+Image";
                            }}
                          />
                        </div>
                        
                        {/* Quick View Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="bg-white text-black hover:bg-white/90 font-medium px-4 shadow-md"
                            onClick={() => handleProductClick(product.amazonLink)}
                          >
                            Quick View
                          </Button>
                        </div>
                        
                        {/* Wishlist Button */}
                        <div className="absolute top-3 right-3 z-10">
                          <Button size="icon" variant="ghost" className="rounded-full bg-white shadow-sm hover:bg-white">
                            <Heart className="h-5 w-5 text-muted-foreground hover:text-rose-500 transition-colors" />
                          </Button>
                        </div>
                      </div>
                      
                      <CardHeader className="p-4 pt-5">
                        <div className="space-y-2">
                          <CardTitle className="font-semibold line-clamp-1">{product.name}</CardTitle>
                          
                          {/* Star rating */}
                          <div className="flex items-center gap-1.5">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.rating) 
                                      ? "fill-yellow-400 text-yellow-400" 
                                      : i < product.rating 
                                        ? "fill-yellow-400/50 text-yellow-400" 
                                        : "fill-muted text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ({product.reviewCount.toLocaleString()})
                            </span>
                          </div>
                          
                          <CardDescription className="line-clamp-2 text-sm min-h-[40px]">
                            {product.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      
                      <CardFooter className="p-4 pt-0 mt-auto">
                        <Button 
                          onClick={() => handleProductClick(product.amazonLink)}
                          variant="default"
                          className="w-full bg-[#FF9900] hover:bg-[#FF9900]/90 text-white font-medium flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"/>
                          </svg>
                          Shop on Amazon
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-8">
              <CarouselPrevious className="relative inline-flex h-10 w-10 border border-border/60 bg-background hover:bg-muted/70" />
              <CarouselNext className="relative inline-flex h-10 w-10 border border-border/60 bg-background hover:bg-muted/70" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">TRAVELER EXPERIENCES</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">What Our Community Says</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from travelers who've explored the world with our guidance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-none shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" /> {testimonial.location}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
                <CardFooter>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-black/70 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url(${destinations.length > 0 ? getDestinationImageUrl(destinations[0]) : DEFAULT_DESTINATION_IMAGE})`,
          }}
        />
        <div className="container mx-auto max-w-4xl text-center relative z-20">
          <Badge className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm mb-6">JOIN US</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Begin Your Adventure Today</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Connect with fellow travelers, share your experiences, and discover
            your next dream destination with our global community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6" 
              asChild
            >
              <Link to="/signup">
                Join Our Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 text-lg px-8 py-6" 
              asChild
            >
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

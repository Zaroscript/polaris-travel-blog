import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, Star } from "lucide-react";
import Layout from "@/components/layout/Layout";
import DestinationCard from "@/components/destination/DestinationCard";
import DestinationMap from "@/components/destination/DestinationMap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDestinationsStore } from "@/store/useDestinationsStore";
import { TravelLoader } from "@/components/ui/travel-loader";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DestinationSkeleton } from "@/components/skeletons/DestinationSkeleton";

const Destinations = () => {
  const navigate = useNavigate();
  
  const { 
    destinations, 
    loading, 
    error,
    fetchDestinations,
    searchDestinations,
    filterDestinations
  } = useDestinationsStore();
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Selected destination state
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(destinations.length / itemsPerPage);
  
  // Get current destinations for pagination
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return destinations.slice(startIndex, endIndex);
  };

  // Handle destination selection (for map highlighting)
  const handleDestinationSelect = (destination: any) => {
    setSelectedDestination(destination);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchDestinations(searchQuery.trim());
    } else {
      // If search query is empty, fetch all destinations or apply the active category filter
      if (activeCategory === "all") {
        fetchDestinations();
      } else {
        filterDestinations({ tags: [activeCategory] });
      }
    }
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery("");
    if (category === "all") {
      fetchDestinations();
    } else {
      filterDestinations({ tags: [category] });
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        await fetchDestinations();
      } catch (err) {
        toast.error("Failed to load destinations");
      }
    };

    loadDestinations();
  }, [fetchDestinations]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the top of the destinations section
    document.getElementById("destinations-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  // Popular destination categories with icons
  const categories = [
    { id: "all", name: "All Destinations", icon: "🌎" },
    { id: "beaches", name: "Beaches", icon: "🏖️" },
    { id: "mountains", name: "Mountains", icon: "🏔️" },
    { id: "cities", name: "Cities", icon: "🏙️" },
    { id: "historical", name: "Historical", icon: "🏛️" },
    { id: "nature", name: "Nature", icon: "🌿" },
    { id: "adventure", name: "Adventure", icon: "🧗" },
    { id: "islands", name: "Islands", icon: "🏝️" },
    { id: "cultural", name: "Cultural", icon: "🎭" },
    { id: "luxury", name: "Luxury", icon: "✨" },
  ];

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section with parallax effect */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1530789253388-582c481c54b0" 
            alt="Travel destinations" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background/95"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Discover Your Next <span className="text-primary">Adventure</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Explore 50+ handpicked destinations around the globe with detailed guides, local tips, and personalized recommendations.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20">
              <Input
                type="text"
                placeholder="Search destinations, countries, or experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none bg-transparent text-white placeholder:text-white/70 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button type="submit" size="sm" className="rounded-full px-6">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
            
            {/* Quick stats */}
            <div className="flex gap-6 mt-8">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">50+</span>
                <span className="text-white/80 text-sm">Destinations</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">100+</span>
                <span className="text-white/80 text-sm">Activities</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">10k+</span>
                <span className="text-white/80 text-sm">Happy Travelers</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" className="w-full h-12 md:h-20">
            <path d="M0 120L48 100C96 80 192 40 288 35C384 30 480 60 576 70C672 80 768 70 864 55C960 40 1056 20 1152 15C1248 10 1344 20 1392 25L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="currentColor" className="text-background"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter Carousel */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <span className="inline-block h-1 w-6 bg-primary"></span>
                EXPLORE DESTINATIONS
              </div>
              <h2 className="text-3xl font-bold">Browse by Category</h2>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full h-10 w-10 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="rounded-full h-10 w-10 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2 sm:gap-3 mt-6">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                variants={item}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  cursor-pointer relative overflow-hidden transition-all duration-300
                  ${activeCategory === category.id 
                    ? 'shadow-md' 
                    : 'hover:shadow-sm'}
                `}
              >
                <div className={`
                  relative z-10 py-5 px-2 w-full flex flex-col items-center justify-center rounded-xl
                  ${activeCategory === category.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card dark:bg-card/80 hover:bg-muted/50 border border-border/30'}
                `}>
                  <div className={`
                    text-3xl mb-2 transition-all duration-300
                    ${activeCategory === category.id ? 'scale-110' : 'group-hover:text-primary'}
                  `}>
                    {category.icon}
                  </div>
                  <div className="text-sm font-medium text-center">
                    {category.name.replace('All Destinations', 'All')}
                  </div>
                </div>
                
                {activeCategory === category.id && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                    layoutId="categoryIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                {/* Glowing effect for active category */}
                {activeCategory === category.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent rounded-xl -z-10 blur-md" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Category description */}
          <motion.div 
            className="mt-6 bg-muted/30 rounded-xl p-4 border border-border/40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={activeCategory}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">
                {categories.find(c => c.id === activeCategory)?.icon}
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  {categories.find(c => c.id === activeCategory)?.name}
                </h3>
                <p className="text-muted-foreground">
                  {activeCategory === "all" && "Explore all our amazing destinations across the globe."}
                  {activeCategory === "beaches" && "Discover perfect sandy shores and crystal-clear waters for ultimate relaxation."}
                  {activeCategory === "mountains" && "Explore majestic peaks, breathtaking views, and alpine adventures."}
                  {activeCategory === "cities" && "Experience vibrant urban cultures, iconic landmarks, and local cuisine."}
                  {activeCategory === "historical" && "Journey through time with ancient ruins, monuments, and historical sites."}
                  {activeCategory === "nature" && "Immerse yourself in pristine landscapes, forests, and natural wonders."}
                  {activeCategory === "adventure" && "Thrill-seeking experiences from hiking to white-water rafting and beyond."}
                  {activeCategory === "islands" && "Escape to paradise on secluded and exotic island getaways."}
                  {activeCategory === "cultural" && "Dive into rich traditions, local customs, and authentic experiences."}
                  {activeCategory === "luxury" && "Indulge in premium accommodations, exclusive experiences, and five-star service."}
                </p>
              </div>
            </div>
          </motion.div>
        </section>
        
        {/* Destinations Section */}
        <section id="destinations-section" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <span className="inline-block h-1 w-6 bg-primary"></span>
                DISCOVER AMAZING PLACES
              </div>
              <h2 className="text-3xl font-bold">Featured Destinations</h2>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-4">
                {destinations.length} destinations found
              </span>
              
              {totalPages > 1 && (
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? "default" : "outline"}
                      size="icon"
                      onClick={() => handlePageChange(index + 1)}
                      className="h-8 w-8"
                    >
                      {index + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <DestinationSkeleton key={index} />
              ))}
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any destinations matching your search criteria. Try adjusting your filters or search term.
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                  fetchDestinations();
                }}>
                  View All Destinations
                </Button>
              </motion.div>
            </div>
          ) : (
            <>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {getCurrentPageItems().map((destination) => (
                  <motion.div
                    key={destination._id}
                    variants={item}
                    className="flex"
                  >
                    <DestinationCard 
                      destination={destination} 
                      onSelect={() => handleDestinationSelect(destination)}
                      isSelected={selectedDestination?._id === destination._id}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </section>

        {/* Interactive Map Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <span className="inline-block h-1 w-6 bg-primary"></span>
                EXPLORE VISUALLY
              </div>
              <h2 className="text-3xl font-bold">Destination Map</h2>
              <p className="text-muted-foreground mt-2">
                Hover over destinations to see details. Click on markers to explore further.
              </p>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="h-[70vh]">
              {destinations.length === 0 ? (
                <div className="h-full flex items-center justify-center bg-muted/30">
                  No destinations to display on the map
                </div>
              ) : (
                <DestinationMap
                  destinations={destinations}
                  selectedDestination={selectedDestination}
                />
              )}
            </div>
          </div>
        </section>

        {/* Travel Inspiration */}
        <section className="py-16 relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-pattern-dots"></div>
          </div>
          
          <div className="relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
                <span className="inline-block h-1 w-6 bg-primary"></span>
                CURATED COLLECTIONS
                <span className="inline-block h-1 w-6 bg-primary"></span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Travel Inspiration</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Discover carefully curated travel collections to inspire your next journey
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground">
                  Popular Destinations
                </Button>
                <Button variant="outline">
                  Seasonal Picks
                </Button>
                <Button variant="outline">
                  Hidden Gems
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="overflow-hidden border-primary/10 hover:border-primary/20 transition-colors group">
                <div className="relative">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1565967511849-76a60a516170" 
                      alt="Summer destinations" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-500/90 hover:bg-yellow-500">Trending</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Summer Escapes 2025</h3>
                  <p className="text-muted-foreground mb-4">
                    Discover the best beach destinations and coastal retreats for your summer vacation
                  </p>
                  <Button variant="link" className="px-0 flex items-center gap-1">
                    View Destinations <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-primary/10 hover:border-primary/20 transition-colors group">
                <div className="relative">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1605649487212-47bdab064df7" 
                      alt="Hidden gems" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-500/90 hover:bg-emerald-500">New</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Off The Beaten Path</h3>
                  <p className="text-muted-foreground mb-4">
                    Explore lesser-known destinations that offer unique experiences away from the crowds
                  </p>
                  <Button variant="link" className="px-0 flex items-center gap-1">
                    View Destinations <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-primary/10 hover:border-primary/20 transition-colors group">
                <div className="relative">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1" 
                      alt="Adventure destinations" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-500/90 hover:bg-blue-500">Popular</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Adventure Awaits</h3>
                  <p className="text-muted-foreground mb-4">
                    Thrilling experiences from mountain climbing to deep sea diving and beyond
                  </p>
                  <Button variant="link" className="px-0 flex items-center gap-1">
                    View Destinations <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="mb-16">
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05" 
                alt="World map" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated on Travel Deals</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Subscribe to our newsletter and be the first to know about exclusive travel deals, new destinations, and insider tips.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <Input placeholder="Enter your email address" className="rounded-lg" />
                <Button className="whitespace-nowrap">
                  Subscribe Now
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-3">
                By subscribing, you agree to our Privacy Policy and consent to receive travel-related updates.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Destinations;

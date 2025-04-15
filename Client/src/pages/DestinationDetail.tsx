import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Globe, Plane, Mountain, ArrowLeft, Star, Heart, Calendar, Clock, Users, BadgeCheck, Sparkles, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDestinationsStore } from "@/store/useDestinationsStore";
import { TravelLoader } from "@/components/ui/travel-loader";
import { formatRelativeTime } from "@/utils/date";
import { toast } from "sonner";
import { getDestinationImageUrl, handleImageError } from "@/lib/imageUtils";
import { normalizeReviews, getDefaultReviews } from "@/lib/reviewUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Review } from "@/types/destination";
import DestinationMap from "@/components/destination/DestinationMap";

const DestinationDetail = () => {
  const { id: destinationId } = useParams();
  const navigate = useNavigate();
  
  const { 
    currentDestination, 
    loading, 
    error,
    fetchDestination,
    addReview
  } = useDestinationsStore();

  const [reviewFormOpen, setReviewFormOpen] = useState(false);

  // Form schema for adding a review
  const reviewFormSchema = z.object({
    rating: z.number().min(1).max(5),
    content: z.string().min(3, {
      message: "Review content must be at least 3 characters."
    })
  });

  // Set up form
  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 5,
      content: ""
    }
  });

  // Submit handler for the review form
  const onSubmitReview = async (values: z.infer<typeof reviewFormSchema>) => {
    if (!destinationId) return;
    
    try {
      // Create a properly typed review data object with required properties
      const reviewData: { rating: number; content: string } = {
        rating: Number(values.rating) || 5, // Ensure it's a number and has a default
        content: values.content || "Great destination!"
      };
      
      await addReview(destinationId, reviewData);
      toast.success("Review added successfully!");
      form.reset();
      setReviewFormOpen(false);
      
      // Fetch the updated destination data to ensure we have the latest state
      await fetchDestination(destinationId);
    } catch (err) {
      toast.error("Failed to add review");
    }
  };

  useEffect(() => {
    const loadDestination = async () => {
      try {
        if (destinationId) {
          await fetchDestination(destinationId);
        } else {
          navigate('/destinations');
        }
      } catch (err) {
        toast.error("Failed to load destination details");
      }
    };

    loadDestination();
  }, [destinationId, fetchDestination, navigate]);

  const handleBack = () => {
    navigate('/destinations');
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

  if (loading || !currentDestination) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
            <TravelLoader variant="default" text="Loading destination..." size="lg" />
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate the average rating
  const avgRating = currentDestination.rating;
  
  // Get up to 3 popular tags
  const popularTags = currentDestination.tags.slice(0, 3);

  // Get the reviews, ensuring they're properly formatted
  const reviews = currentDestination?.reviews ? 
    normalizeReviews(currentDestination.reviews) : 
    [];

  return (
    <Layout>
      {/* Immersive Hero Section - Fixed and improved */}
      <div className="relative h-[70vh] w-full flex items-end">
        <div className="absolute inset-0">
          <img 
            src={getDestinationImageUrl(currentDestination)} 
            alt={currentDestination.name} 
            className="w-full h-full object-cover"
            onError={(e) => handleImageError(e, currentDestination.name)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-background/95"></div>
        </div>
        
        {/* Floating back button */}
        <div className="absolute top-4 left-4 z-20">
          <Button 
            onClick={handleBack} 
            variant="secondary" 
            size="sm"
            className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        {/* Hero Content */}
        <div className="w-full p-6 md:p-12 relative z-10">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {popularTags.map((tag) => (
                <Badge key={tag} className="bg-primary/80 hover:bg-primary/90 text-white capitalize">{tag}</Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">{currentDestination.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-white/90 mb-6">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{currentDestination.location.city}, {currentDestination.location.country}</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-white/50"></div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{currentDestination.rating.toFixed(1)}</span>
                <span className="text-sm text-white/70">({currentDestination.reviews?.length || 0} reviews)</span>
              </div>
              <div className="hidden md:block h-1 w-1 rounded-full bg-white/50"></div>
              <div className="hidden md:flex items-center gap-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Best time: {currentDestination.bestTimeToVisit.from} - {currentDestination.bestTimeToVisit.to}</span>
              </div>
            </div>
            <p className="text-white/90 max-w-3xl text-lg md:text-xl leading-relaxed">
              {currentDestination.description.length > 220 
                ? `${currentDestination.description.substring(0, 220)}...` 
                : currentDestination.description}
            </p>
            
            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Button className="gap-2">
                <Heart className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/20 gap-2">
                <MapPin className="h-4 w-4" />
                Show on Map
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" className="w-full h-10 md:h-14">
            <path d="M0 120L48 100C96 80 192 40 288 35C384 30 480 60 576 70C672 80 768 70 864 55C960 40 1056 20 1152 15C1248 10 1344 20 1392 25L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="currentColor" className="text-background"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-12"
            >
              {/* About Section */}
              <motion.section variants={item} className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="inline-block h-1 w-6 bg-primary"></span>
                  ABOUT THIS DESTINATION
                </div>
                <h2 className="text-2xl font-bold mb-4">About {currentDestination.name}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {currentDestination.description}
                </p>
              </motion.section>

              {/* Gallery */}
              <motion.section variants={item} className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="inline-block h-1 w-6 bg-primary"></span>
                  PHOTO GALLERY
                </div>
                <h2 className="text-2xl font-bold mb-4">Image Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentDestination.images && currentDestination.images.length > 0 ? (
                    currentDestination.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="aspect-video overflow-hidden rounded-lg relative group"
                      >
                        <img 
                          src={typeof image === 'object' ? image.url : image} 
                          alt={typeof image === 'object' ? image.caption || `${currentDestination.name} photo ${index + 1}` : `${currentDestination.name} photo ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => handleImageError(e, `${currentDestination.name}-${index}`)}
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/40">
                            View Larger
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">No gallery images available for this destination.</p>
                    </div>
                  )}
                </div>
              </motion.section>

              {/* Map Location - Updated to use improved DestinationMap */}
              <motion.section variants={item} className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="inline-block h-1 w-6 bg-primary"></span>
                  LOCATION
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Interactive Map</h2>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" /> 
                    {currentDestination.location.country}
                  </Badge>
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  <DestinationMap 
                    destinations={[currentDestination]} 
                    singleView={true}
                    selectedDestination={currentDestination}
                    height="400px"
                  />
                </div>
                <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <p className="font-medium">Address</p>
                  </div>
                  <p className="text-muted-foreground ml-6">
                    {currentDestination.location.address || `${currentDestination.location.city}, ${currentDestination.location.country}`}
                  </p>
                </div>
              </motion.section>

              {/* Reviews */}
              <motion.section variants={item} className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="inline-block h-1 w-6 bg-primary"></span>
                  TRAVELER EXPERIENCES
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Visitor Reviews</h2>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setReviewFormOpen(!reviewFormOpen)}>
                    <Star className="h-4 w-4" />
                    {reviewFormOpen ? "Cancel" : "Write a Review"}
                  </Button>
                </div>

                {/* Review Form */}
                {reviewFormOpen && (
                  <Card className="mb-6 border-primary/20">
                    <CardContent className="p-4 pt-6">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitReview)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rating</FormLabel>
                                <div className="flex items-center gap-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => field.onChange(star)}
                                      className="focus:outline-none"
                                    >
                                      <Star
                                        className={`h-6 w-6 ${
                                          star <= field.value
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-muted-foreground"
                                        }`}
                                      />
                                    </button>
                                  ))}
                                  <span className="ml-2 text-sm text-muted-foreground">
                                    {field.value}/5
                                  </span>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Review</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Share your experience with this destination..."
                                    className="resize-none min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end">
                            <Button type="submit">Submit Review</Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4 mt-6">
                  {reviews.length > 0 ? (
                    reviews.map((review: Review) => (
                      <Card key={review._id} className="border border-border/40 overflow-hidden transition-all hover:shadow-md">
                        <CardContent className="p-5">
                          <div className="flex items-center mb-3">
                            <Avatar className="h-10 w-10 mr-3 ring-2 ring-primary/10">
                              <AvatarImage 
                                src={review.author?.profilePic} 
                                alt={review.author?.fullName || "Anonymous"} 
                              />
                              <AvatarFallback>
                                {review.author?.fullName ? review.author.fullName.charAt(0) : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.author?.fullName || "Anonymous User"}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-3.5 w-3.5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} 
                                    />
                                  ))}
                                </div>
                                <span className="mx-2">•</span>
                                <span>{formatRelativeTime(review.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.content}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
                      <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </div>
              </motion.section>
            </motion.div>
          </div>

          <div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {/* Quick Facts - Improved Card */}
              <motion.section variants={item}>
                <Card className="border border-primary/10 overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Destination Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="divide-y divide-border">
                      <li className="p-4 flex items-start">
                        <Globe className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">
                            {currentDestination.location.city}, {currentDestination.location.country}
                          </p>
                        </div>
                      </li>
                      <li className="p-4 flex items-start">
                        <Star className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Rating</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3.5 w-3.5 ${i < Math.floor(currentDestination.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {currentDestination.rating.toFixed(1)} / 5
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="p-4 flex items-start">
                        <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Best Time to Visit</p>
                          <p className="text-sm text-muted-foreground">
                            {currentDestination.bestTimeToVisit.from} - {currentDestination.bestTimeToVisit.to}
                          </p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            <Clock className="h-3 w-3 mr-1" /> 
                            Recommended Season
                          </Badge>
                        </div>
                      </li>
                      <li className="p-4 flex items-start">
                        <Mountain className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Popular For</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {currentDestination.tags.slice(0, 5).map((tag) => (
                              <Badge key={tag} variant="outline" className="capitalize">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="bg-primary/5 border-t border-primary/10 p-4">
                    <Button variant="default" className="w-full gap-2">
                      <Heart className="h-4 w-4" />
                      Save to Favorites
                    </Button>
                  </CardFooter>
                </Card>
              </motion.section>

              {/* Things to Do - Improved Card */}
              <motion.section variants={item}>
                <Card className="border border-primary/10 overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                      Things to Do
                    </CardTitle>
                    <CardDescription>
                      Activities recommended by locals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="space-y-3">
                      {currentDestination.thingsToDo.map((activity, index) => (
                        <li key={index} className="flex items-start group">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary mr-3 text-xs font-medium group-hover:bg-primary group-hover:text-white transition-colors">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.section>

              {/* Local Tips - New Card */}
              <motion.section variants={item}>
                <Card className="border border-primary/10 overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Local Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="rounded-lg bg-muted/30 p-3">
                      <p className="font-medium text-sm mb-1">Best time to visit:</p>
                      <p className="text-sm text-muted-foreground">
                        {currentDestination.bestTimeToVisit.from} through {currentDestination.bestTimeToVisit.to} for optimal weather and fewer crowds.
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-3">
                      <p className="font-medium text-sm mb-1">Local cuisine:</p>
                      <p className="text-sm text-muted-foreground">
                        Don't miss trying the local specialties and traditional dishes for an authentic experience.
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-3">
                      <p className="font-medium text-sm mb-1">Getting around:</p>
                      <p className="text-sm text-muted-foreground">
                        Public transportation is readily available and offers an affordable way to explore the area.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-primary/5 border-t border-primary/10 p-4">
                    <Button variant="link" className="gap-1 w-full justify-center text-primary hover:text-primary/80">
                      View more local tips
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.section>

              {/* Similar Destinations */}
              <motion.section variants={item} className="bg-card rounded-xl border shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">You Might Also Like</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="h-14 w-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e" 
                        alt="Similar destination" 
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">Maldives</p>
                      <p className="text-xs text-muted-foreground">Tropical Paradise</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="h-14 w-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9" 
                        alt="Similar destination" 
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">Venice, Italy</p>
                      <p className="text-xs text-muted-foreground">Romantic Canal City</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="h-14 w-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1555400038-63f5ba517a47" 
                        alt="Similar destination" 
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">Santorini, Greece</p>
                      <p className="text-xs text-muted-foreground">Mediterranean Gem</p>
                    </div>
                  </div>
                </div>
              </motion.section>
            </motion.div>
          </div>
        </div>
        
        {/* Call to action section */}
        <section className="mt-16 mb-8">
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1499678329028-101435549a4e" 
                alt="Travel planning" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience {currentDestination.name}?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Plan your trip to {currentDestination.name} with our expert travel advisors and get personalized recommendations.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Button className="gap-2" size="lg">
                  <Plane className="h-4 w-4" />
                  Plan Your Trip
                </Button>
                <Button variant="outline" className="gap-2" size="lg">
                  <Heart className="h-4 w-4" />
                  Save to Wishlist
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DestinationDetail;

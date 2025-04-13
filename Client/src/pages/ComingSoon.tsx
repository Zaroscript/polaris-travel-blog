import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  Mail, 
  Clock, 
  Calendar, 
  Send, 
  AlertCircle,
  Instagram, 
  Twitter, 
  Facebook,
  Linkedin,
  Github,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { FaInstagram, FaTwitter, FaFacebook, FaLinkedin, FaPinterest } from 'react-icons/fa';

// Form schema for the newsletter signup
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" })
});

type FormValues = z.infer<typeof formSchema>;

const ComingSoon = () => {
  // State for countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Form for newsletter signup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log("Subscription email:", data.email);
    // Here you would normally send this to your backend
    form.reset();
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const [showSuccess, setShowSuccess] = useState(false);

  // Set launch date (30 days from now)
  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(timer);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({
        days,
        hours,
        minutes,
        seconds
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Upcoming features to showcase
  const upcomingFeatures = [
    {
      title: "Virtual Travel Experiences",
      description: "Immersive 360° tours of exotic destinations from the comfort of your home.",
      icon: <Globe className="h-8 w-8 text-primary" />,
      progress: 75
    },
    {
      title: "AI Travel Planner",
      description: "Custom itineraries created by our advanced AI based on your preferences.",
      icon: <Brain className="h-8 w-8 text-primary" />,
      progress: 60
    },
    {
      title: "Travel Community",
      description: "Connect with like-minded travelers and share experiences in real-time.",
      icon: <Users className="h-8 w-8 text-primary" />,
      progress: 85
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1931&q=80')",
            backgroundPosition: "center 30%"
          }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        <div className="relative container mx-auto py-28 px-4 text-center">
          <Badge variant="outline" className="bg-background/20 backdrop-blur-sm text-white border-primary/40 mb-4">
            Coming Soon
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Something Amazing Is <span className="text-primary">Coming</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            We're working on a new feature that will transform your travel experience. 
            Stay tuned for updates!
          </p>
          
          {/* Countdown Timer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            <Card className="bg-background/20 backdrop-blur-sm border-primary/20">
              <CardContent className="p-4 text-center">
                <span className="text-3xl md:text-4xl font-bold text-white">{timeLeft.days}</span>
                <p className="text-white/70 text-sm md:text-base">Days</p>
              </CardContent>
            </Card>
            <Card className="bg-background/20 backdrop-blur-sm border-primary/20">
              <CardContent className="p-4 text-center">
                <span className="text-3xl md:text-4xl font-bold text-white">{timeLeft.hours}</span>
                <p className="text-white/70 text-sm md:text-base">Hours</p>
              </CardContent>
            </Card>
            <Card className="bg-background/20 backdrop-blur-sm border-primary/20">
              <CardContent className="p-4 text-center">
                <span className="text-3xl md:text-4xl font-bold text-white">{timeLeft.minutes}</span>
                <p className="text-white/70 text-sm md:text-base">Minutes</p>
              </CardContent>
            </Card>
            <Card className="bg-background/20 backdrop-blur-sm border-primary/20">
              <CardContent className="p-4 text-center">
                <span className="text-3xl md:text-4xl font-bold text-white">{timeLeft.seconds}</span>
                <p className="text-white/70 text-sm md:text-base">Seconds</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Newsletter Signup */}
          <div className="max-w-md mx-auto">
            <Card className="bg-background/30 backdrop-blur-md border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-xl flex items-center justify-center gap-2">
                  <Mail className="h-5 w-5 text-primary" /> Get Notified
                </CardTitle>
                <CardDescription className="text-white/70">
                  Subscribe to be the first to know when we launch.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex">
                            <FormControl>
                              <Input 
                                placeholder="Enter your email" 
                                {...field} 
                                className="rounded-r-none bg-background/20 border-primary/20 text-white placeholder:text-white/50"
                              />
                            </FormControl>
                            <Button type="submit" className="rounded-l-none">
                              Notify Me <Send className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                {showSuccess && (
                  <div className="mt-2 p-2 bg-green-500/20 border border-green-500/50 rounded-md text-white text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" /> You're now subscribed! We'll notify you when we launch.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* What's Coming Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">What's Coming</h2>
            <div className="w-20 h-1 bg-primary rounded mb-4 mx-auto"></div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're working on some exciting features that will enhance your travel experience. 
              Here's a sneak peek of what's in development:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingFeatures.map((feature, index) => (
              <Card key={index} className="border-primary/10 hover:border-primary/30 transition-colors duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-semibold mb-0">
                    {feature.title}
                  </CardTitle>
                  {feature.icon}
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col items-start pt-2">
                  <div className="w-full flex items-center gap-2 mb-1">
                    <span className="text-sm text-muted-foreground">Progress:</span>
                    <Progress value={feature.progress} className="h-2" />
                    <span className="text-sm text-muted-foreground">{feature.progress}%</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* About this release section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="about">About the Update</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>The Next Generation of Travel</CardTitle>
                  <CardDescription>
                    Learn about our upcoming major update and what it means for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    At Polaris Travel Blog, we're committed to continuously improving and evolving our platform to provide you with the best travel experience possible. Our upcoming update represents a significant leap forward in how you discover, plan, and share your travel adventures.
                  </p>
                  <p>
                    With advanced AI recommendations, immersive virtual experiences, and enhanced social features, we're building a comprehensive travel ecosystem that understands your preferences and connects you with like-minded travelers around the world.
                  </p>
                  <p>
                    This update is the result of months of research, development, and feedback from our community. We're excited to bring these new features to you and can't wait to see how they transform your travel experience.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="faq" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Common questions about our upcoming features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">When exactly will the new features launch?</h3>
                      <p className="text-muted-foreground">
                        We're targeting a launch in approximately 30 days. The exact date will be announced soon on our social media channels and via email to our subscribers.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-lg">Will the new features be available on mobile?</h3>
                      <p className="text-muted-foreground">
                        Yes! All new features will be available on both our web platform and mobile applications simultaneously.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-lg">Will there be any cost for the new features?</h3>
                      <p className="text-muted-foreground">
                        Most features will be available to all users for free. Some premium features may be part of our upcoming Polaris Pro membership plan. Details will be shared closer to launch.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Development Timeline</CardTitle>
                  <CardDescription>
                    Our roadmap to launch and beyond
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l-2 border-muted pl-6 pb-2 space-y-8">
                    <div className="relative">
                      <div className="absolute -left-[29px] p-1 rounded-full bg-primary">
                        <div className="h-4 w-4 rounded-full bg-background"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center mb-1">
                          <Calendar className="mr-2 h-4 w-4 text-primary" /> Today
                        </h3>
                        <p className="text-muted-foreground">
                          Development phase: 90% complete
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[29px] p-1 rounded-full bg-muted">
                        <div className="h-4 w-4 rounded-full bg-muted-foreground/30"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center mb-1">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" /> Day 15
                        </h3>
                        <p className="text-muted-foreground">
                          Beta testing begins with select users
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[29px] p-1 rounded-full bg-muted">
                        <div className="h-4 w-4 rounded-full bg-muted-foreground/30"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center mb-1">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" /> Day 25
                        </h3>
                        <p className="text-muted-foreground">
                          Final testing and preparations
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[29px] p-1 rounded-full bg-muted">
                        <div className="h-4 w-4 rounded-full bg-muted-foreground/30"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center mb-1">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" /> Day 30
                        </h3>
                        <p className="text-muted-foreground">
                          Official launch to all users
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Social Media Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-6">Follow Our Progress</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Stay up to date with our development journey by following us on social media.
            We'll be sharing sneak peeks and behind-the-scenes content regularly.
          </p>
          
          <div className="flex justify-center gap-4 mb-10">
            <a href="#" className="h-12 w-12 rounded-full bg-background flex items-center justify-center border border-primary/20 hover:border-primary/60 transition-colors duration-300">
              <FaInstagram className="h-5 w-5 text-primary" />
            </a>
            <a href="#" className="h-12 w-12 rounded-full bg-background flex items-center justify-center border border-primary/20 hover:border-primary/60 transition-colors duration-300">
              <FaTwitter className="h-5 w-5 text-primary" />
            </a>
            <a href="#" className="h-12 w-12 rounded-full bg-background flex items-center justify-center border border-primary/20 hover:border-primary/60 transition-colors duration-300">
              <FaFacebook className="h-5 w-5 text-primary" />
            </a>
            <a href="#" className="h-12 w-12 rounded-full bg-background flex items-center justify-center border border-primary/20 hover:border-primary/60 transition-colors duration-300">
              <FaLinkedin className="h-5 w-5 text-primary" />
            </a>
            <a href="#" className="h-12 w-12 rounded-full bg-background flex items-center justify-center border border-primary/20 hover:border-primary/60 transition-colors duration-300">
              <FaPinterest className="h-5 w-5 text-primary" />
            </a>
          </div>
          
          <Button variant="outline" className="group" size="lg">
            Explore Current Features <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default ComingSoon;

function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M2 12H22"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function Brain(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.5 2C8.67157 2 8 2.67157 8 3.5C8 4.32843 8.67157 5 9.5 5C10.3284 5 11 4.32843 11 3.5C11 2.67157 10.3284 2 9.5 2Z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M14.5 2C13.6716 2 13 2.67157 13 3.5C13 4.32843 13.6716 5 14.5 5C15.3284 5 16 4.32843 16 3.5C16 2.67157 15.3284 2 14.5 2Z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M2 14.5C2 13.6716 2.67157 13 3.5 13C4.32843 13 5 13.6716 5 14.5C5 15.3284 4.32843 16 3.5 16C2.67157 16 2 15.3284 2 14.5Z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M19 14.5C19 13.6716 19.6716 13 20.5 13C21.3284 13 22 13.6716 22 14.5C22 15.3284 21.3284 16 20.5 16C19.6716 16 19 15.3284 19 14.5Z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M5 14.5H8M19 14.5H16"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M8 14.5C8 11.4624 10.4624 9 13.5 9H16"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M16 14.5C16 17.5376 13.5376 20 10.5 20H8"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M16 9C16 6.79086 14.2091 5 12 5"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M8 20C8 22.2091 9.79086 24 12 24"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

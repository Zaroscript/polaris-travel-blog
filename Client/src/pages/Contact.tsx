import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Phone, Mail, Send, Clock, ArrowRight, Globe, Shield } from "lucide-react";
import img from "/contact-us-top-backround-img.png";

import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(3, {
    message: "Subject must be at least 3 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const officeData = [
  {
    city: "London",
    phone: "+44 20 1234 5678",
    email: "london@polaris-travel.com",
    address: "123 Oxford Street, London",
    hours: "Mon-Fri: 9AM-6PM",
    image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1000&auto=format&fit=crop"
  },
  {
    city: "Paris",
    phone: "+33 1 2345 6789",
    email: "paris@polaris-travel.com",
    address: "95 Avenue des Champs-Élysées",
    hours: "Mon-Fri: 9AM-6PM",
    image: "https://media.istockphoto.com/id/1665716741/photo/aerial-view-of-paris-france-overlooking-the-famous-eiffel-tower-sunrise-in-the-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=4bPLZt7O_2OAPKZgtDIbIKAVjk4l7BCl3w6_F8j-C2M="
  },
  {
    city: "Barcelona",
    phone: "+34 93 123 4567",
    email: "barcelona@polaris-travel.com",
    address: "78 La Rambla, Barcelona",
    hours: "Mon-Fri: 9AM-6PM",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=1000&auto=format&fit=crop"
  }
];

const faqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for bookings. For certain destinations, we also offer cryptocurrency payments for added flexibility."
  },
  {
    question: "Do you offer travel insurance?",
    answer: "Yes, we offer comprehensive travel insurance packages to protect your journey. Our premium plans cover medical emergencies, trip cancellations, lost luggage, and even adventure activities, depending on your destination."
  },
  {
    question: "How far in advance should I book my trip?",
    answer: "For popular destinations during peak season (summer, holidays), we recommend booking 6-8 months in advance. For off-season travel or less popular destinations, 3-4 months is usually sufficient to secure the best rates."
  },
  {
    question: "What is your cancellation policy?",
    answer: "Our flexible cancellation policy allows free cancellation up to 30 days before departure. For cancellations 15-29 days before travel, a 30% fee applies. Cancellations within 14 days may incur up to a 70% fee, depending on the package."
  }
];

const Contact: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send the form data to a server
    alert("Message sent successfully!");
    form.reset();
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.08),transparent)] dark:bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.12),transparent)]"></div>

        <div className="container mx-auto px-4 py-16 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20 mb-4">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  We're here to help
                </div>
                <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">Let's start your <span className="text-primary">travel adventure</span> together</h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Our global team of travel experts is ready to assist you with personalized itineraries, exclusive deals, and insider tips for your next journey. Reach out today and let us transform your travel dreams into reality.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="default" size="lg" className="gap-2 rounded-full">
                  <Phone className="h-4 w-4" />
                  Talk to an Expert
                </Button>
                <Button variant="outline" size="lg" className="gap-2 rounded-full dark:border-gray-700 dark:text-gray-200">
                  <Mail className="h-4 w-4" />
                  Email Us
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Global Offices</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">24/7 Support</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Secure Booking</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/20 to-primary opacity-70 blur-xl"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-xl p-2 shadow-xl">
                  <AspectRatio ratio={4 / 3} className="rounded-lg overflow-hidden">
                    <img src={img} className="object-cover w-full h-full" alt="Contact Us" />
                  </AspectRatio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Global Offices</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
              Visit us at one of our international offices where our travel experts can help you plan your next adventure in person.
            </p>
          </div>

          <Tabs defaultValue="London" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-8">
              {officeData.map(office => (
                <TabsTrigger key={office.city} value={office.city}>{office.city}</TabsTrigger>
              ))}
            </TabsList>

            {officeData.map(({ city, phone, email, address, hours, image }) => (
              <TabsContent key={city} value={city} className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden rounded-xl bg-slate-50 dark:bg-gray-800 shadow-lg">
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <img
                      src={image}
                      alt={city}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Our office in {city}</h3>
                    <div className="space-y-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="text-gray-700 dark:text-gray-200">{phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                          <p className="text-gray-700 dark:text-gray-200">{email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                          <p className="text-gray-700 dark:text-gray-200">{address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Working Hours</p>
                          <p className="text-gray-700 dark:text-gray-200">{hours}</p>
                        </div>
                      </div>
                    </div>
                    <Button className="mt-8 w-full sm:w-auto" variant="default">
                      <span>Schedule a Visit</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Map and Contact Form */}
      <div className="py-20 bg-slate-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20 mb-4">
              Get in Touch
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Send us a Message</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
              Have questions about our travel packages or need help planning your trip? Our team is ready to assist you with all your travel needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <Card className="shadow-lg border-0 dark:bg-gray-800 overflow-hidden">
              <div className="h-2 bg-primary w-full"></div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Contact Form</h3>
                <Separator className="my-4 dark:bg-gray-700" />
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-200">Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your full name"
                              {...field}
                              className="focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-200">Email address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your.email@example.com"
                              {...field}
                              className="focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-200">Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="How can we help you?"
                              {...field}
                              className="focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-200">Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write your message here..."
                              className="min-h-[120px] resize-none focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full text-white bg-primary hover:bg-primary/90 transition-colors rounded-md"
                    >
                      <span className="mr-2 text-primary-foreground">Send Message</span>
                      <Send className="h-4 w-4 text-primary-foreground"/>
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="rounded-lg overflow-hidden shadow-lg h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.7295896117936!2d-74.00601508459515!3d40.712775179330736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a19b1d8e43f%3A0x80b8a76377a3db63!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2seg!4v1712688721000!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "500px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20 mb-4">
              Questions & Answers
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
              Find quick answers to common questions about our services and travel arrangements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
              >
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">Still have questions? Reach out to our support team.</p>
            <Button variant="outline" className="gap-2 rounded-full dark:border-gray-700 dark:text-gray-200">
              <Mail className="h-4 w-4" />
              support@polaris-travel.com
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;

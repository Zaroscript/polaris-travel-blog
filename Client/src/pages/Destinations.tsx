import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Globe, Plane, Mountain, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { destinations } from "@/data/destinations";
import DestinationCard from "@/components/destination/DestinationCard";
import DestinationMap from "@/components/destination/DestinationMap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Destinations = () => {
  const [searchParams] = useSearchParams();
  const destinationId = searchParams.get("id");
  const [selectedDestination, setSelectedDestination] = useState(
    destinationId
      ? destinations.find((d) => d.id === Number(destinationId))
      : null
  );

  useEffect(() => {
    if (destinationId) {
      const destination = destinations.find(
        (d) => d.id === Number(destinationId)
      );
      setSelectedDestination(destination || null);
    } else {
      setSelectedDestination(null);
    }
  }, [destinationId]);

  const handleBack = () => {
    window.history.pushState({}, "", "/destinations");
    setSelectedDestination(null);
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {selectedDestination ? (
          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Destinations
            </Button>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="rounded-lg overflow-hidden mb-6 h-[400px]">
                    <img
                      src={selectedDestination.image}
                      alt={selectedDestination.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h1 className="text-4xl font-bold mb-2">{selectedDestination.name}</h1>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{selectedDestination.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedDestination.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="prose prose-lg max-w-none"
                  >
                    <p className="text-lg mb-6">{selectedDestination.description}</p>

                    <p className="mb-6">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
                      Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus 
                      rhoncus ut eleifend nibh porttitor.
                    </p>

                    <h2 className="text-2xl font-bold mb-4">Things to Do</h2>
                    <ul className="space-y-4 list-none pl-0">
                      {["Visit the famous landmarks", "Try local cuisine", "Explore nature trails", "Experience local culture"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                            {i + 1}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Destination Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Best Time to Visit</h3>
                          <p className="text-sm text-muted-foreground">April to October</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Plane className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Getting There</h3>
                          <p className="text-sm text-muted-foreground">International airport with connections</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Mountain className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Attractions</h3>
                          <p className="text-sm text-muted-foreground">Mountains, beaches, historical sites</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold mb-4">Discover Amazing Destinations</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our curated list of breathtaking destinations around the world, 
                from bustling cities to serene landscapes.
              </p>
            </motion.div>

            <DestinationMap />

            <section className="my-12">
              <h2 className="text-2xl font-bold mb-6">Featured Destinations</h2>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {destinations.slice(0, 3).map((destination) => (
                  <motion.div key={destination.id} variants={item}>
                    <DestinationCard destination={destination} />
                  </motion.div>
                ))}
              </motion.div>
            </section>

            <Separator className="my-12" />

            <section>
              <h2 className="text-2xl font-bold mb-6">All Destinations</h2>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {destinations.map((destination) => (
                  <motion.div key={destination.id} variants={item}>
                    <DestinationCard destination={destination} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Destinations;

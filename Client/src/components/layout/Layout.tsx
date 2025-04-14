import { FC, ReactNode } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import Intro from "./intro";


interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <Intro />

      <motion.main
        className="flex-grow pt-16"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;

import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Notification from "../pages/Notification";
import AccountSettings from "../pages/AcountSettings";
import Sidebar from "../components/Sidebar/Sidebar";
import Layout from "../components/layout/Layout";

const Settings = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto p-4 lg:p-8">
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <Sidebar activePath={location.pathname} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-8 rounded-lg border bg-card p-4">
              <Sidebar activePath={location.pathname} />
            </div>
          </aside>
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<AccountSettings />} />
              <Route path="/notification" element={<Notification />} />
            </Routes>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;

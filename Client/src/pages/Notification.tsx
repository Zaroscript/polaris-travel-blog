import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NotificationItem {
  label: string;
  desc: string;
  defaultChecked: boolean;
}

const Notification = () => {
  const notifications: NotificationItem[] = [
    {
      label: "Likes and Comments",
      desc: "Get notified when someone likes or comments on your posts",
      defaultChecked: true,
    },
    {
      label: "Reply to My comments",
      desc: "Receive notifications when someone replies to your comments",
      defaultChecked: true,
    },
    {
      label: "Subscriptions",
      desc: "Get updates about your subscription status and renewals",
      defaultChecked: true,
    },
    {
      label: "Birthdays",
      desc: "Receive reminders about your connections' birthdays",
      defaultChecked: false,
    },
    {
      label: "Events",
      desc: "Stay updated about upcoming events and meetups",
      defaultChecked: true,
    },
    {
      label: "Email notifications",
      desc: "Receive important updates via email",
      defaultChecked: false,
    },
    {
      label: "Push notifications",
      desc: "Get real-time updates through push notifications",
      defaultChecked: true,
    },
  ];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Choose how you want to receive notifications. You can change these
          settings at any time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notifications.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1 space-y-1">
                <Label
                  htmlFor={`notification-${index}`}
                  className="text-base font-semibold"
                >
                  {item.label}
                </Label>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                id={`notification-${index}`}
                defaultChecked={item.defaultChecked}
              />
            </div>
            {index < notifications.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}

        <Button className="w-full mt-6">Save Changes</Button>
      </CardContent>
    </Card>
  );
};

export default Notification;

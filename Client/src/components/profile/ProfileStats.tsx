import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types/user";
import { Users, Bookmark, MessageSquare, Heart } from "lucide-react";

interface ProfileStatsProps {
  user: User;
  detailed?: boolean;
}

const ProfileStats = ({ user, detailed = false }: ProfileStatsProps) => {
  const stats = [
    {
      title: "Posts",
      value: user.posts?.length || 0,
      icon: MessageSquare,
    },
    {
      title: "Followers",
      value: user.followers.length,
      icon: Users,
    },
    {
      title: "Following",
      value: user.following.length,
      icon: Users,
    },
    {
      title: "Saved",
      value: user.savedPosts.length,
      icon: Bookmark,
    },
  ];

  if (detailed) {
    stats.push(
      {
        title: "Total Likes",
        value:
          user.posts?.reduce((acc, post) => acc + post.likes.length, 0) || 0,
        icon: Heart,
      },
      {
        title: "Total Comments",
        value:
          user.posts?.reduce(
            (acc, post) => acc + (post.comments?.length || 0),
            0
          ) || 0,
        icon: MessageSquare,
      }
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProfileStats;

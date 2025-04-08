import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Bookmark,
  Copy,
  CheckCheck,
  Trash2,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";

interface PostMenuProps {
  postId: string;
  authorId: string;
  onSave: (postId: string) => void;
  onCopyLink: (postId: string) => void;
  onDelete: (postId: string) => void;
  onEdit: (postId: string) => void;
  isSaved: boolean;
  isCopied: boolean;
}

const PostMenu = ({
  postId,
  authorId,
  onSave,
  onCopyLink,
  onDelete,
  onEdit,
  isSaved,
  isCopied,
}: PostMenuProps) => {
  const { authUser } = useAuthStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-primary/10"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSave(postId)}>
          <Bookmark className="h-4 w-4 mr-2" />
          {isSaved ? "Unsave" : "Save"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCopyLink(postId)}>
          {isCopied ? (
            <>
              <CheckCheck className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy link
            </>
          )}
        </DropdownMenuItem>
        {authorId === authUser?._id && (
          <>
            <DropdownMenuItem onClick={() => onEdit(postId)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(postId)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostMenu;

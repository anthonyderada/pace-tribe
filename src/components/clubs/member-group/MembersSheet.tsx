import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Members from "@/pages/Members";

const queryClient = new QueryClient();

export const MembersSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="w-full mt-2 text-zinc-400 hover:text-zinc-200"
        >
          View all members
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl bg-zinc-900 border-zinc-800">
        <SheetHeader>
          <SheetTitle className="text-white">All Members</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <QueryClientProvider client={queryClient}>
            <Members />
          </QueryClientProvider>
        </div>
      </SheetContent>
    </Sheet>
  );
};
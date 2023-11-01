import { Skeleton } from "./ui/skeleton";

export const PostLoading = () => {
  return (
    <div className="flex flex-col lg:space-y-8 space-y-6 pb-10">
      <Skeleton className="w-full h-12" />
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="w-full md:h-64 h-60" />
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-6 md:w-2/3 w-3/4" />
        <Skeleton className="h-6 md:w-1/2 w-2/3" />
        <Skeleton className="h-6 md:w-1/3 w-1/2" />
        <Skeleton className="h-6 md:w-1/4 w-1/3" />
      </div>
    </div>
  );
};

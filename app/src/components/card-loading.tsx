import { Skeleton } from "./ui/skeleton";

export const CardLoading = () => {
  return (
    <>
      {Array(10)
        .fill(0)
        .map((index) => (
          <div className="flex flex-col" key={index}>
            <Skeleton className="h-[35vh] md:h-[30vh] lg:h-[45vh] rounded-md" />
          </div>
        ))}
    </>
  );
};

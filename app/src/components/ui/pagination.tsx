import { Button } from "./button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPage,
  onPageChange,
}: PaginationProps) => {
  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center pb-10">
      <div className="md:flex items-center gap-4 hidden">
        {currentPage == 1 ? (
          <Button disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
        {pages.map((page) => (
          <Button
            key={page}
            className={page === currentPage ? "font-bold" : ""}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        {currentPage == totalPage ? (
          <Button disabled>
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="md:hidden items-center gap-4 flex">
        {currentPage == 1 ? (
          <Button disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
        <Button>{currentPage}</Button>
        {currentPage == totalPage ? (
          <Button disabled>
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

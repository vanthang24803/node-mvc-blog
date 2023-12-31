import { Blog } from "type";
import { Card } from "./card";
import { HeaderMain } from "./header-main";
import { Pagination } from "./ui/pagination";
import { CardLoading } from "./card-loading";

interface ContainerProps {
  blogs: Blog[];
  loading: boolean;
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

const Container = ({
  blogs,
  currentPage,
  totalPage,
  loading,
  onPageChange,
}: ContainerProps) => {
  return (
    <div className="flex-col md:gap-8 gap-4">
      <HeaderMain />
      <div className="mt-20 mb-14 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        {loading ? <CardLoading /> : <Card data={blogs} />}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Container;

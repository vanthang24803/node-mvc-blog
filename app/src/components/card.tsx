import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Blog } from "type";
import { format } from "date-fns";
import { SubDrop } from "./subdrop";

interface CardProps {
  data: Blog[] | null;
  idMember?: string | null;
}

export const Card = ({ data, idMember }: CardProps) => {
  return (
    <>
      {data?.map((card) => (
        <div className="w-full flex flex-col" key={card._id}>
          <Link to={`/post/${card._id}`} key={card._id}>
            <img
              src={card.image}
              alt="card-image"
              className="w-full object-cover rounded-md border lg:h-60 md:h-48 h-56"
            />
          </Link>
          <div className="flex flex-col space-y-3 lg:px-2 lg:py-4 p-3">
            <Link
              to={`/post/${card._id}`}
              key={card._id}
              className="flex flex-col space-y-3"
            >
              <span className="lg:text-2xl md:text-base text-lg font-bold hover:text-blue-500">
                {card.title}
              </span>
              <span className="text-neutral-500 lg:text-base md:text-sm">
                {card.description}
              </span>
            </Link>
            {card.author._id ? (
              <span className="text-neutral-700 lg:text-base md:text-sm">
                {card.updatedAt &&
                  format(new Date(card.updatedAt), "MMMM dd, yyyy")}
              </span>
            ) : (
              <>
                {idMember ? (
                  <span className="text-neutral-700 lg:text-base md:text-sm">
                    {card.updatedAt &&
                      format(new Date(card.updatedAt), "dd/MM/yyyy HH:mm:ss")}
                  </span>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-700 lg:text-base md:text-sm">
                      {card.updatedAt &&
                        format(new Date(card.updatedAt), "dd/MM/yyyy HH:mm:ss")}
                    </span>
                    <SubDrop blog={card} />
                  </div>
                )}
              </>
            )}
            {card.author._id && (
              <div className="flex space-x-2 items-center">
                <Avatar>
                  <AvatarImage src={card.author.imageUrl} alt="image" />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
                <span className="font-medium">
                  {card.author.firstName} {card.author.lastName}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

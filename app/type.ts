export interface UserType {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  createAt?: string;
  updateAt?: string;
  blogs?: Blog[];
}

export interface Blog {
  _id: string;
  title: string;
  description?: string;
  content?:string;
  image?: string;
  createAt?: string;
  updatedAt?: string;
  author: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl:string;
  };
}

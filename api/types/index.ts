export interface Signup {
  email: string;
  password: string;
  name: string;
  phone: string;
  birthday: string;
  address: Address;
}

// 登入
export interface Login {
  email: string;
  password: string;
}

// 取得大部分的結構
export interface GetResult<T> {
  status: boolean;
  result: T;
}

export interface Result {
  _id: string;
  title: string;
  description: string;
  diningTime?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  smallImage: string;
}

// 房型
export interface RoomResult {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageUrlList: string[];
  areaInfo: string;
  bedInfo: string;
  maxPeople: number;
  price: number;
  status: number;
  layoutInfo: Info[];
  facilityInfo: Info[];
  amenityInfo: Info[];
  createdAt: string;
  updatedAt: string;
  smallImageUrl: string;
  smallImageUrlList: string[];
}

interface Info {
  title: string;
  isProvide: boolean;
}

// 訂單
export interface Order {
  roomId?: RoomResult;
  checkInDate: string;
  checkOutDate: string;
  peopleNum: number;
  userInfo: UserInfo;
  orderUserId?: string;
  status?: number;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserInfo {
  address: Address;
  name: string;
  phone: string;
  email: string;
  _id?: string;
  birthday?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Address {
  zipcode: string;
  detail: string;
}

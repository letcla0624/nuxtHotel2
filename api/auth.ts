import type { GetResult, Login, Signup } from "./types";

interface LoginRoot {
  status: boolean;
  token: string;
  result: Result;
}

interface Result {
  address: Address;
  _id: string;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface Address {
  zipcode: number;
  detail: string;
  county: string;
  city: string;
}

const baseURL = process.env.BASE_URL;

// 登入
export async function login(body: Login) {
  const { result, status, token } = await $fetch<LoginRoot>("/user/login", {
    method: "POST",
    baseURL,
    body,
    onResponseError({ response }) {
      const { message } = response._data;
      console.error("Error:", message);
    },
  });

  return { result, status, token };
}

// 註冊
export async function signup(body: Signup) {
  const { result, status } = await $fetch<GetResult<Signup>>("/user/signup", {
    method: "POST",
    baseURL,
    body,
    onResponseError({ response }) {
      const { message } = response._data;
      console.error("Error:", message);
    },
  });

  return { result, status };
}

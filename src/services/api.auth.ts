import api from "@/config/api";
import { AuthResponse } from "@/types";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  return data;
}

export async function register(email: string, password: string, name: string): Promise<void> {
  await api.post("/auth/register", { email, password, name });
}

import { UserRole } from "../../../../generated/prisma/client.js"

const createAdmin = async (data: any) => {
  const userData = {
    email: data.admin.email,
    password: data.password,
    role: UserRole.ADMIN
  }
  return { message: "Admin created successfully" }
}

export const userService = {
  createAdmin
}

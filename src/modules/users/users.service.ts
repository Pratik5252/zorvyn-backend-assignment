import { User } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IUser, IUsers } from "../../types";
import AppError from "../../utils/appError";
import { hashPassword } from "../../utils/bcrypt";
import { CreateUserInput, UpdateUserInput } from "../../validators/schema";

export const userService = {
  /**
   * Creates a new user in the system
   * @param {CreateUserInput} data - The user details for creating a new user
   * @returns {Promise<Partial<User>>} The created user object
   */
  async createUser(data: CreateUserInput): Promise<Omit<IUser, "updatedAt">> {
    const existingUser = await prisma.user.findFirst({
      where: { email: data.email, deletedAt: null },
    });

    if (existingUser) {
      throw AppError.conflict("Email already registered", "EMAIL_EXISTS");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  },

  /**
   * Retrieves all users from the system
   * @returns {Promise<IUsers>} A list of all users with pagination info
   */
  async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<IUsers> {
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    //get total count for pagination
    const total = await prisma.user.count({
      where: {
        deletedAt: null,
      },
    });

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },


  /**
   * Retrieves a user by their unique ID
   * @param userId - The unique identifier of the user to retrieve
   * @returns {Promise<IUser>} The user object if found, otherwise throws an error
   */
  async getUserById(userId: string): Promise<IUser> {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw AppError.notFound("User not found", "USER_NOT_FOUND");
    }

    return user;
  },

  /**
   * Updates a user's information
   * @param userId - The unique identifier of the user to update
   * @param data - The updated user details
   * @returns {Promise<IUser>} The updated user object
   */
  async updateUser(userId: string, data: UpdateUserInput): Promise<IUser> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (!user || user.deletedAt) {
        throw AppError.notFound("User not found", "USER_NOT_FOUND");
    }

    if(data.email && data.email !== user.email){
        const emailExists = await prisma.user.findFirst({
            where: { email: data.email },
        });
        if(emailExists){
            throw AppError.conflict("Email already in use", "EMAIL_EXISTS");
        }
    }

    const updateUser = await prisma.user.update({
        where: { id: userId },
        data: {
            ...data,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    })
    return updateUser;
  },

  async deleteUser(userId: string): Promise<{ message: string; userId: string }> {

    const user = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (!user || user.deletedAt) {
        throw AppError.notFound("User not found", "USER_NOT_FOUND");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

    return {
      message: "User deleted successfully",
      userId
    }
  }
};

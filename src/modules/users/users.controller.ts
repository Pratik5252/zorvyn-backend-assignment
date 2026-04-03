import { Request, Response, NextFunction } from 'express';
import { createUserSchema, paginationSchema, updateUserSchema } from '../../validators/schema';
import { userService } from './users.service';
import { sendSuccess } from '../../utils/apiResponse';

// Controller for handling user creation
// Validates input, creates user, and returns the created user object
export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction  
) => {
    try {
        const data = createUserSchema.parse(req.body);
        const user = await userService.createUser(data);

        res.status(201).json(
            sendSuccess(201, "User created successfully", user)
        );
    } catch (error) {
        next(error);
    }
}

// Controller for retrieving all users
// Supports pagination and returns a list of users with pagination info
export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction  
) => {
    try {
        const {page, limit} = paginationSchema.parse(req.query);
        const result = await userService.getAllUsers(page, limit);

        res.status(200).json(
            sendSuccess(200, "Users retrieved successfully", result)
        );
    } catch (error) {
        next(error);
    }
}


// Controller for retrieving all users
// Supports pagination and returns a list of users with pagination info
export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction  
) => {
    try {
        const {id} = req.params;
        const result = await userService.getUserById(id as string);

        res.status(200).json(
            sendSuccess(200, "User retrieved successfully", result)
        );
    } catch (error) {
        next(error);
    }
}

// Controller for updating a user's information
// Validates input, updates user, and returns the updated user object
export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction  
) => {
    try {
        const {id} = req.params;
        const data = updateUserSchema.parse(req.body);
        const result = await userService.updateUser(id as string, data);

        res.status(200).json(
            sendSuccess(200, "User updated successfully", result)
        );
    } catch (error) {
        next(error);
    }
}

// Controller for deleting a user
// Marks the user as deleted without removing from the database
export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction  
) => {
    try {
        const {id} = req.params;
        const result = await userService.deleteUser(id as string);

        res.status(200).json(
            sendSuccess(200, "User deleted successfully", result)
        );
    } catch (error) {
        next(error);
    }
}

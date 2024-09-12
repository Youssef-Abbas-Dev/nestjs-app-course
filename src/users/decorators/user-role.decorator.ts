import { SetMetadata } from "@nestjs/common";
import { UserType } from "../../utils/enums";

// Roles Method Decorator
export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
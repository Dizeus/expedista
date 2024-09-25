import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { ROLE_KEY } from "src/assets/constants/roles";

export const Role = (role: string): CustomDecorator<string> => SetMetadata(ROLE_KEY, role);

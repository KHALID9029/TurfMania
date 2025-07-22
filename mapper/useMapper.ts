import {IUser} from "@/models/User";
import UserDto from "@/dto/userDto";

export function toUserDto(user: IUser): UserDto {
    return {
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        nid: user.nid,
        role: user.role,
        street: user.street,
        postCode: user.postCode,
        city: user.city,
        profilePicture: user.profilePicture // Optional profile picture field
    };
}
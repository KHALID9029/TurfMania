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

// Helper function to parse request to playerDto
export async function parseRequestToPlayerDto(data: FormData) {
    
    const body ={
        id: data.get('id') as string,
        name: data.get('name') as string,
        email: data.get('email') as string,
        phone: data.get('phone') as string,
        nid: data.get('nid') as string,
        role: data.get('role') as string || 'Player', // Default to 'Player' if not provided
        street: data.get('street') as string,
        postCode: data.get('postCode') as string,
        city: data.get('city') as string,
        profilePicture: data.get('profilePicture') as string // Optional profile picture field
    }

    return {
        userId: parseInt(body.id) || 0,
        name: body.name,
        email: body.email,
        phone: body.phone,
        nid: body.nid,
        role: body.role,
        street: body.street,
        postCode: body.postCode,
        city: body.city,
        profilePicture: body.profilePicture // Optional profile picture field
    }
}
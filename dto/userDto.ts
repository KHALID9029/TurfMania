export default interface UserDto {
    userId: number; // Custom auto-increment field for public use
    name: string;
    email: string;
    phone?: string;
    nid?: string;
    role: string;
    street?: string;
    postCode?: string;
    city?: string;
    profilePicture?: string; // Optional profile picture field
}
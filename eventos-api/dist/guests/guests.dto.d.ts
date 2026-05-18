export declare enum GuestStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    DECLINED = "declined"
}
export declare class CreateGuestDto {
    name: string;
    email: string;
}
export declare class UpdateGuestDto {
    status?: GuestStatus;
}

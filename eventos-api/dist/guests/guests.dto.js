"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGuestDto = exports.CreateGuestDto = exports.GuestStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var GuestStatus;
(function (GuestStatus) {
    GuestStatus["PENDING"] = "pending";
    GuestStatus["CONFIRMED"] = "confirmed";
    GuestStatus["DECLINED"] = "declined";
})(GuestStatus || (exports.GuestStatus = GuestStatus = {}));
class CreateGuestDto {
}
exports.CreateGuestDto = CreateGuestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pedro Alves' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGuestDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pedro@email.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateGuestDto.prototype, "email", void 0);
class UpdateGuestDto {
}
exports.UpdateGuestDto = UpdateGuestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: GuestStatus, default: GuestStatus.PENDING }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GuestStatus),
    __metadata("design:type", String)
], UpdateGuestDto.prototype, "status", void 0);
//# sourceMappingURL=guests.dto.js.map
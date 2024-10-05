import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from 'bcryptjs';
import { LoginDto } from "./dtos/login.dto";
import { JWTPayloadType, AccessTokenType } from "../utils/types";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class AuthProvider {

    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
    ) { }

    /**
   * Create new user
   * @param registerDto data for creating new user
   * @returns JWT (access token)
   */
    public async register(registerDto: RegisterDto): Promise<AccessTokenType> {
        const { email, password, username } = registerDto;

        const userFromDb = await this.usersRepository.findOne({ where: { email } });
        if (userFromDb) throw new BadRequestException("user already exist");

        const hashedPassword = await this.hashPassword(password);

        let newUser = this.usersRepository.create({
            email,
            username,
            password: hashedPassword,
        });

        newUser = await this.usersRepository.save(newUser);

        const accessToken = await this.generateJWT({ id: newUser.id, userType: newUser.userType });
        return { accessToken };
    }

    /**
     * Log In user
     * @param loginDto data for log in to user account
     * @returns JWT (access token)
     */
    public async login(loginDto: LoginDto): Promise<AccessTokenType> {
        const { email, password } = loginDto;

        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) throw new BadRequestException("invalid email or password");

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) throw new BadRequestException("invalid email or password");

        const accessToken = await this.generateJWT({ id: user.id, userType: user.userType });
        
        await this.mailService.sendLogInEmail(user.email);
        return { accessToken };
    }

    /**
     * Hashing password
     * @param password plain text password
     * @returns hashed password
     */
    public async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    /**
     * Generate Json Web Token
     * @param payload JWT payload
     * @returns token
     */
    private generateJWT(payload: JWTPayloadType): Promise<string> {
        return this.jwtService.signAsync(payload);
    }
}
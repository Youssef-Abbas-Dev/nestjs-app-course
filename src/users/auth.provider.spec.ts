import { Test, TestingModule } from "@nestjs/testing";
import { AuthProvider } from "./auth.provider";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../mail/mail.service";
import { ConfigService } from "@nestjs/config";
import { RegisterDto } from "./dtos/register.dto";

describe('AuthProvider', () => {
    let authProvider: AuthProvider;
    let usersRepository: Repository<User>;
    let mailService: MailService;
    let configService: ConfigService;
    const REPOSITORY_TOKEN = getRepositoryToken(User);
    const registerDto: RegisterDto = {
        email: 'admin@email.com',
        username: 'admin',
        password: '123456'
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthProvider,
                { provide: JwtService, useValue: {} },
                { provide: MailService, useValue: {
                    sendVerifyEmailTemplate: jest.fn()
                }},
                {
                    provide: ConfigService, useValue: {
                        get: jest.fn()
                    }
                },
                {
                    provide: REPOSITORY_TOKEN, useValue: {
                        findOne: jest.fn(),
                        create: jest.fn((dto: RegisterDto) => Promise.resolve(dto)),
                        save: jest.fn((user: User) => Promise.resolve({ id: 1, ...user })),
                    }
                }
            ]
        }).compile();

        authProvider = module.get<AuthProvider>(AuthProvider);
        usersRepository = module.get<Repository<User>>(REPOSITORY_TOKEN);
        mailService = module.get<MailService>(MailService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it("should authProvider be defined", () => {
        expect(authProvider).toBeDefined();
    });

    it("should usersRepository be defined", () => {
        expect(usersRepository).toBeDefined();
    });

    // Register
    describe('register()', () => {
        it("should call 'findOne' method in users repository", async () => {
            await authProvider.register(registerDto);
            expect(usersRepository.findOne).toHaveBeenCalled();
            expect(usersRepository.findOne).toHaveBeenCalledTimes(1)
        });

        it("should call 'create' method in users repository", async () => {
            await authProvider.register(registerDto);
            expect(usersRepository.create).toHaveBeenCalled();
            expect(usersRepository.create).toHaveBeenCalledTimes(1);
        });

        it("should call 'save' method in users repository", async () => {
            await authProvider.register(registerDto);
            expect(usersRepository.save).toHaveBeenCalled();
            expect(usersRepository.save).toHaveBeenCalledTimes(1);
        });

        it("should call 'sendVerifyEmailTemplate' method in mail service", async () => {
            await authProvider.register(registerDto);
            expect(mailService.sendVerifyEmailTemplate).toHaveBeenCalled();
            expect(mailService.sendVerifyEmailTemplate).toHaveBeenCalledTimes(1);
        });

        it("should call 'get' method in config service", async () => {
            await authProvider.register(registerDto);
            expect(configService.get).toHaveBeenCalled();
            expect(configService.get).toHaveBeenCalledTimes(1);
        });
    })
});
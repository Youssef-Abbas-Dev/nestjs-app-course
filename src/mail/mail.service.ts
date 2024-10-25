import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, RequestTimeoutException } from "@nestjs/common";

@Injectable()
export class MailService { 
    constructor(private readonly mailerService: MailerService) { }

    /**
     * Sending email after user logged in to his account
     * @param email logged in user email
     */
    public async sendLogInEmail(email: string) {
        try {
            const today = new Date();
            
            await this.mailerService.sendMail({
                to: email,
                from: `<no-reply@my-nestjs-app.com>`,
                subject: 'Log in',
                template: 'login',
                context: { email, today }
            })
        } catch (error) {
            console.log(error);
            throw new RequestTimeoutException();
        }
    }


    /**
     * Sending verify email template
     * @param email email of the registered user
     * @param link link with id of the user and verification token
     */
    public async sendVerifyEmailTemplate(email: string, link: string) {
        try {
            await this.mailerService.sendMail({
                to: email,
                from: `<no-reply@my-nestjs-app.com>`,
                subject: 'Verify your account',
                template: 'verify-email',
                context: { link }
            })
        } catch (error) {
            console.log(error);
            throw new RequestTimeoutException();
        }
    }

    /**
     * Sending reset password template
     * @param email email of the user
     * @param resetPasswordLink link with id of the user and reset password token
     */
    public async sendResetPasswordTemplate(email: string, resetPasswordLink: string) {
        try {
            await this.mailerService.sendMail({
                to: email,
                from: `<no-reply@my-nestjs-app.com>`,
                subject: 'Reset password',
                template: 'reset-password',
                context: { resetPasswordLink }
            })
        } catch (error) {
            console.log(error);
            throw new RequestTimeoutException();
        }
    }
}
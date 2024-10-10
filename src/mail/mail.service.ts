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
}
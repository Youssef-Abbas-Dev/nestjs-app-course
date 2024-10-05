import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, RequestTimeoutException } from "@nestjs/common";

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    /**
     * sending email after user logged in his account
     * @param user the logged in user
     */
    public async sendLogInEmail(email: string) {
        try {
            const today = new Date();
            await this.mailerService.sendMail({
                to: email,
                from: `<no-reply@my-nestjs-app.com>`,
                subject: 'Log in',
                html: `
                 <div>
                   <h2>Hi ${email}</h2>
                   <p>
                     You logged in to your account in ${today.toDateString()} at ${today.toLocaleTimeString()}
                   </p>
                 </div>
                `
            })
        } catch (error) {
            console.log(error);
            throw new RequestTimeoutException();
        }
    }
}
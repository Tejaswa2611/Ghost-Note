export function VerificationEmail({ username, otp }: { username: string; otp: string }): string {
    return `
        <div>
            <h1>Hello, ${username}!</h1>
            <p>You're almost there! To complete your registration, please enter the following verification code:</p>
            <p><b>Verification Code: ${otp}</b></p>
            <p>This code is valid for 10 minutes. Please do not share this code with anyone.</p>
            <p>Thank you for joining us!</p>
        </div>
    `;
}

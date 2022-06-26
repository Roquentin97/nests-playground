export const mailerConfig = {host: process.env.MAILER_HOST,
port: Number(process.env.MAILER_PORT),
secure: process.env.MAILER_SECURE === 'secure',
auth: {
  user: process.env.MAILER_USER,
  pass: process.env.MAILER_PASSWORD
}
}
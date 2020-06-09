interface IMailConfig {
  driver: 'ethereal' | 'ses';
  reset_email_url: string;
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  reset_email_url: `${process.env.APP_WEB_URL}/reset-password`,
  defaults: {
    from: {
      email: 'tiago@startse.com',
      name: 'Tiago',
    },
  },
} as IMailConfig;

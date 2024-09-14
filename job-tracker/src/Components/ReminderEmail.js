import emailjs from 'emailjs-com';

const sendEmail = (email, minutes) => {
  const milliseconds = minutes * 60 * 1000;

  setTimeout(() => {
    const templateParams = {
      to_email: email,
      message: 'This is a reminder to follow up on your application.'
    };

    emailjs.send('service_zehmlri', 'template_7k0g1oq', templateParams, 'KMAWV91wrDXkqm3Hh')
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
      }, (error) => {
        console.error('Failed to send email.', error);
      });
  }, milliseconds);
};

export default sendEmail;

const validateEmail = (email) => {
  const re = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
  return re.test(email);
};

module.exports = {
  validateEmail,
};

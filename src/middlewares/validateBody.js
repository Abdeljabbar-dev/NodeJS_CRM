const Joi = require("joi");

module.exports = {
  validateBody: schema => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        let message = "validation error";
        if (result.error.details && result.error.details.length > 0)
          message = result.error.details[0].message;
        return res.status(400).json({ success: false, message });
      }

      if (!req.value) {
        req.value = {};
      }
      req.value["body"] = result.value;
      next();
    };
  },

  schemas: {
    UserSchema: Joi.object().keys({
      email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required(),
      password: Joi.string().required(),
      lastName: Joi.string()
        .optional()
        .allow(""),
      firstName: Joi.string()
        .optional()
        .allow(""),
      tel: Joi.string()
        .optional()
        .allow(""),
      gender: Joi.string()
        .optional()
        .allow(""),
      location: Joi.string()
        .optional()
        .allow("")
    })
  }
};

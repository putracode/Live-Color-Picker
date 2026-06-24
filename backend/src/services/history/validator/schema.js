import Joi from "joi";

export const createHistorySchema = Joi.object({
  colorName: Joi.string().max(100).required(),
  hex: Joi.string().max(20).required(),
  rgb: Joi.string().max(50).required(),
  hsl: Joi.string().max(50).required(),
  hsv: Joi.string().max(50).required(),
});
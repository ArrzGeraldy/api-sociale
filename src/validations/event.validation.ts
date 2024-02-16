import Joi from 'joi'
import EventType from '../types/event.type'

export const createEventValidaton = (payload: EventType) => {
  const schema = Joi.object({
    event_id: Joi.string().required(),
    title: Joi.string().required(),
    desc: Joi.string().required(),
    startEvent: Joi.string().required(),
    endEvent: Joi.string().required(),
    location: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.string().allow('', null),
    author: Joi.object().required()
  })
  return schema.validate(payload)
}

export const createUpdateEventValidation = (payload: EventType) => {
  const schema = Joi.object({
    event_id: Joi.string().allow('', null),
    title: Joi.string().allow('', null),
    desc: Joi.string().allow('', null),
    startEvent: Joi.string().allow('', null),
    endEvent: Joi.string().allow('', null),
    location: Joi.string().allow('', null),
    category: Joi.string().allow('', null),
    price: Joi.string().allow('', null),
    author: Joi.object().allow('', null)
  })

  return schema.validate(payload)
}

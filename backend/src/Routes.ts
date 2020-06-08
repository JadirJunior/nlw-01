import express from 'express';
import Points_Controller from './controllers/points_controller';
import ItemsController from './controllers/items_controller';
import multerConfig from './config/multer';
import multer from 'multer';
import {celebrate, Joi} from 'celebrate';

const routes = express.Router();

const upload = multer(multerConfig);



const points_controller = new Points_Controller();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);
routes.post('/points',  
upload.single('image'),  
celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
    },)
}, {
    abortEarly: false,
}),
points_controller.create);
routes.get('/points', points_controller.index);
routes.get('/points/:id', points_controller.show)

export default routes;
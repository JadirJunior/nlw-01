import knex from '../database/connection';
import {Request, Response} from 'express';


class PointsController {
    async index(request:Request, response: Response) {
        //cidade, uf, items (Query Params)
        const {city, uf, items} = request.query;

        const parsedItems = String(items)   
        .split(',')
        .map(item=>  Number(item.trim()) );    


        const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('uf', String(uf))
        .where('city', String(city))
        .distinct() 
        .select('points.*')

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.0.1:3333/uploads/${point.image}`,
            }
        });


        return response.json(serializedPoints);
    }


    async show(request: Request, response: Response) {
        const {id} = request.params;

        const point  = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(404).json({message: 'point not found'});
        }

        const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id)
        .select('items.title');

        const serializedPoint = {
            ...point,
                image_url: `http://192.168.0.104:3333/uploads/${point.image}`,
        }
                
            
        

        return response.json({point: serializedPoint, items});
    }

    async create(request: Request,response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
    
       const trx = await knex.transaction(); // variável para q não seja executada a inserção com erro em alguma parte
    
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }
       const Insertedids =  await trx('points').insert(point);
    
        const point_id = Insertedids[0];
    
        const pointItems = items
        .split(',')
        .map((item:string) => Number(item.trim()))
        .map((item_id: number) => {
            return{
                item_id,
                point_id
            }
        });
    
        await trx('point_items').insert(pointItems);

        await trx.commit();
    
        return response.json({
            id: point_id,
            ...point, 
        });
    }
}

export default PointsController;
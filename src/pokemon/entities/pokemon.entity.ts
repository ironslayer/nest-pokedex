import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

//agregamos el Document para que sepa que es un documento de mongo

//schema sirve para definir la estructura de la base de datos
@Schema()
export class Pokemon extends Document{


    // id: string //esta linea no es neceseria porque mongo te lo genera

    //el @Prop es para definir las propiedades de la base de datos y se le puede pasar un objeto con propiedades
    @Prop({
        unique: true,
        index: true,
    })
    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    no: number; 
}

export const PokemonSchema = SchemaFactory.createForClass( Pokemon ); 
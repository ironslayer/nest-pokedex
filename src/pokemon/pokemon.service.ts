import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';

import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';

@Injectable()
export class PokemonService {

  constructor(
    //el @InjectModel() es para inyectar el modelo de mongoose y sirve para hacer las operaciones de la base de datos
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
  ){}

  //el async es para que sea una funcion asincrona
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      
      //la siguiente linea es para crear un nuevo pokemon, el await es para esperar a que se cree el pokemon
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;

    } catch (error) {
      this.handleException(error);

    }

    
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {

    let pokemon: Pokemon;
    //la condicional dentro del if significa que si el id es un numero y el + es para convertirlo a numero
    if (!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({ no: term})
    }


    //mongo 1d

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    //Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });
    }



    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`); 
    }



    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);
    if(updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }

    try{
      await pokemon.updateOne(updatePokemonDto, {new: true});
      return {...pokemon.toJSON(), ...updatePokemonDto};

    } catch (error) {
      this.handleException(error);
    }


  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();  
    // return {id};
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const {deletedCount} = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
      
    }
    return;
  }

  private handleException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in DB ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create pokemon - Check server logs`);
  }
}

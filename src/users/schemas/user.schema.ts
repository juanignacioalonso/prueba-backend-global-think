import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Definimos el Perfil como un sub-documento
@Schema()
export class Profile {
    @Prop()
    codigo: string;

    @Prop()
    nombre_perfil: string;
}

@Schema()
export class User extends Document {
    // MongoDB genera el 'id' automáticamente, pero lo mapeamos si es necesario

    @Prop({ required: true })
    nombre: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    edad: number;

    @Prop({ type: Profile, required: true }) // Perfil anidado
    perfil: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
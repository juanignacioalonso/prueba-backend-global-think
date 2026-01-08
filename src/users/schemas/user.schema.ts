import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Definicion del Perfil como un sub-documento
@Schema()
export class Profile {
    @Prop()
    codigo: string;

    @Prop()
    nombre_perfil: string;
}

@Schema()
export class User extends Document {
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
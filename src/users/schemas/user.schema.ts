import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Profile {
    @Prop()
    id: number;

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

    @Prop({ required: true })
    password: string;

    @Prop({ type: Profile, required: true })
    perfil: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
import {
    Table, Column, Model, UpdatedAt, CreatedAt, AllowNull, Default, ForeignKey, Unique, IsEmail, BelongsTo, DataType
} from 'sequelize-typescript';

import {RightType} from "./right-types.model";

@Table({tableName: 'Users'})
export class User extends Model<User> {
    @Column(DataType.TEXT)
    name: string;

    @IsEmail
    @AllowNull(false)
    @Unique
    @Column(DataType.TEXT)
    email: string;

    @Column(DataType.TEXT)
    secret: string;

    @Column(DataType.TEXT)
    comment: string;

    @AllowNull(false)
    @Default(1)
    @ForeignKey(() => RightType)
    @Column
    rightTypeId: number;

    @BelongsTo(() => RightType)
    rightType: RightType;

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;
}


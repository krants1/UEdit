import {Table, Column, Model, CreatedAt, DataType} from 'sequelize-typescript';

@Table({tableName: 'RightTypes', timestamps: false})
export class RightType extends Model<RightType> {
    @Column(DataType.TEXT)
    name: string;
}

import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { Gift } from './gift.model';
import { User } from 'src/modules/users/modeles/users.model';
import { PurchaseStatus } from '@repo/dto';

@Table
export class GiftBuyer extends Model<GiftBuyer> {
  @ForeignKey(() => Gift)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  giftId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.ENUM(...Object.values(PurchaseStatus)),
    allowNull: false,
    defaultValue: PurchaseStatus.WAITING,
  })
  status: PurchaseStatus;
}

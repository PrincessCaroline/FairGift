import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Gift } from './modeles/gift.model';
import { GiftBuyer } from './modeles/gift-buyer.model';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [SequelizeModule.forFeature([Gift, GiftBuyer]), GroupModule],
  controllers: [GiftController],
  providers: [GiftService]
})

export class GiftModule { }

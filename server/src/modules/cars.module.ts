import { CarsController } from '@controllers';
import { Car } from '@entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsService } from '@services';

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}

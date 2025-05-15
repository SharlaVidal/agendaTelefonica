import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { LogService } from 'src/logs/log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Phone } from './entities/phone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Phone])],
  controllers: [ContactController],
  providers: [ContactService, LogService]
})
export class ContactModule {}

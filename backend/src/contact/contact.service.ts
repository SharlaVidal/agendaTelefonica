import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { LogService } from 'src/logs/log.service';
import { Phone } from './entities/phone.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly logService: LogService,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create({
        ...createContactDto,
        phones: createContactDto.phones.map((phone) => ({
            number: phone
        })),
    });
    return this.contactRepository.save(contact);
  }

 async findAll(name?: string, phone?: string): Promise<Contact[]> {
  const query = this.contactRepository
    .createQueryBuilder('contact')
    .leftJoinAndSelect('contact.phones', 'phone');

  if (name) {
    query.andWhere('LOWER(contact.name) LIKE LOWER(:name)', { name: `%${name}%` });
  }

  if (phone) {
    query.andWhere('phone.number LIKE :phone', { phone: `%${phone}%` });
  }

  return query.getMany();
}

  async findOne(id: number): Promise<Contact> {
    return this.contactRepository.findOneOrFail({
      where: { id },
      relations: ['phones'],
    });
  }

async update(id: number, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findOne(id);

    Object.assign(contact, updateContactDto);

    if (updateContactDto.phones) {
        contact.phones = updateContactDto.phones.map((phone) => ({
            number: phone,
        } as Phone));
    }

    return this.contactRepository.save(contact);
}

  async remove(id: number): Promise<void> {
    const contact = await this.findOne(id);
    await this.contactRepository.delete(id);
    this.logService.logExclusao(contact.name);
  }
}
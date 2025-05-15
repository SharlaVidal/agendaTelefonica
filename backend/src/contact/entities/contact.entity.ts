import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Phone } from 'src/contact/entities/phone.entity';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @OneToMany(() => Phone, (phone: Phone) => phone.contact, { cascade: true })
  phones: Phone[];
}

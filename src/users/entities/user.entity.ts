import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Address } from '../../addresses/entities/address.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  cpfOrCnpj: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];
}

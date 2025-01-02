import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async createOrUpdateAddress(
    userId: string,
    addressData: Partial<Address>,
  ): Promise<Address> {
    const address = this.addressRepository.create({
      ...addressData,
      user: { id: userId },
    });
    return this.addressRepository.save(address);
  }
}

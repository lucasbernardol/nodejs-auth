import { EntityRepository, Repository } from 'typeorm';
import { Address } from '../entities/Address';

@EntityRepository(Address)
class AddressRepositories extends Repository<Address> {}

export { AddressRepositories };

import { Controller, Get } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('/get-addreses')
  async getAddresses() {
    return await this.addressService.getAddresses();
  }

}

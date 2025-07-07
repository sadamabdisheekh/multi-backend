import { Controller, Get } from '@nestjs/common';
import { ParcelService } from './parcel.service';

@Controller('parcel')
export class ParcelController {
  constructor(private readonly parcelService: ParcelService) {}

  @Get('/get-parcel-types')
  async getParcelTypes() {
    return await this.parcelService.getParcelTypes();
  }
}

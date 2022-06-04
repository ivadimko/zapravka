import { Injectable } from '@nestjs/common';
import { Station } from '@/stations/models/station.model';
import { OkkoService } from '@/stations/okko/okko.service';
import { UpgService } from '@/stations/upg/upg.service';
import { SocarService } from '@/stations/socar/socar.service';

@Injectable()
export class StationsService {
  constructor(
    private readonly okkoService: OkkoService,
    private readonly upgService: UpgService,
    private readonly socarService: SocarService,
  ) {}

  async findAll(): Promise<Station[]> {
    const stations = await Promise.all([
      this.socarService.findAll(),
      this.upgService.findAll(),
      this.okkoService.findAll(),
    ]);

    return stations.flat();
  }
}

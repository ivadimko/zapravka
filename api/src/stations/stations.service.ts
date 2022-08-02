import { Injectable } from '@nestjs/common';
import { Station } from '@/stations/models/station.model';
import { OkkoService } from '@/stations/okko/okko.service';
import { UpgService } from '@/stations/upg/upg.service';
import { SocarService } from '@/stations/socar/socar.service';
import { WogService } from '@/stations/wog/wog.service';
import { AviasService } from '@/stations/avias/avias.service';
import { BrsmService } from '@/stations/brsm/brsm.service';
import { MottoService } from '@/stations/motto/motto.service';
import { AmicService } from '@/stations/amic/amic.service';
import { StationProvider } from '@/stations/stations.typedefs';

@Injectable()
export class StationsService {
  constructor(
    private readonly okkoService: OkkoService,
    private readonly upgService: UpgService,
    private readonly socarService: SocarService,
    private readonly wogService: WogService,
    private readonly aviasService: AviasService,
    private readonly brsmService: BrsmService,
    private readonly mottoService: MottoService,
    private readonly amicService: AmicService,
  ) {}

  stationProviderService = {
    [StationProvider.Okko]: this.okkoService,
    [StationProvider.UPG]: this.upgService,
    [StationProvider.Socar]: this.socarService,
    [StationProvider.Wog]: this.wogService,
    [StationProvider.Avias]: this.aviasService,
    [StationProvider.BRSM]: this.brsmService,
    [StationProvider.Motto]: this.mottoService,
    [StationProvider.Amic]: this.amicService,
  };

  async findAll(): Promise<Station[]> {
    const stations = await Promise.all([
      this.amicService.findAll(),
      this.mottoService.findAll(),
      this.brsmService.findAll(),
      this.aviasService.findAll(),
      this.wogService.findAll(),
      this.socarService.findAll(),
      this.upgService.findAll(),
      this.okkoService.findAll(),
    ]);

    return stations.flat();
  }

  async findById(
    provider: StationProvider,
    id: string,
  ): Promise<Station | null> {
    return this.stationProviderService[provider].findById(id);
  }
}

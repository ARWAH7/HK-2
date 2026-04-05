import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialTheoreticalEntity } from './entities/material-theoretical.entity';
import { MaterialActualEntity } from './entities/material-actual.entity';
import { MaterialVarianceEntity } from './entities/material-variance.entity';
import { OrdersService } from '../orders/orders.service';
import { BomService } from '../bom/bom.service';
import { ProductSpecEntity } from '../specs/entities/product-spec.entity';

@Injectable()
export class MaterialAnalysisService {
  constructor(
    @InjectRepository(MaterialTheoreticalEntity)
    private readonly theoreticalRepo: Repository<MaterialTheoreticalEntity>,
    @InjectRepository(MaterialActualEntity)
    private readonly actualRepo: Repository<MaterialActualEntity>,
    @InjectRepository(MaterialVarianceEntity)
    private readonly varianceRepo: Repository<MaterialVarianceEntity>,
    @InjectRepository(ProductSpecEntity)
    private readonly specRepo: Repository<ProductSpecEntity>,
    private readonly ordersService: OrdersService,
    private readonly bomService: BomService,
  ) {}

  private getBasisValue(orderItem: any, spec: ProductSpecEntity, basis: string) {
    const quantity = Number(orderItem.quantity || 0);
    const plannedRollCount = Number(orderItem.plannedRollCount || 0);
    const plannedMeter = Number(orderItem.plannedMeter || 0);
    const plannedWeight = Number(orderItem.plannedWeight || 0);
    const piecePerPack = Number(spec?.piecePerPack || 0);
    const packPerBox = Number(spec?.packPerBox || 0);

    switch (basis) {
      case 'roll':
        return plannedRollCount;
      case 'meter':
        return plannedMeter;
      case 'weight':
        return plannedWeight;
      case 'piece':
        if (orderItem.unit === 'piece') return quantity;
        if (orderItem.unit === 'pack') return quantity * piecePerPack;
        if (orderItem.unit === 'box') return quantity * packPerBox * piecePerPack;
        return 0;
      case 'pack':
        if (orderItem.unit === 'pack') return quantity;
        if (orderItem.unit === 'piece') return piecePerPack ? quantity / piecePerPack : 0;
        if (orderItem.unit === 'box') return quantity * packPerBox;
        return 0;
      case 'box':
        if (orderItem.unit === 'box') return quantity;
        if (orderItem.unit === 'pack') return packPerBox ? quantity / packPerBox : 0;
        if (orderItem.unit === 'piece') return piecePerPack && packPerBox ? quantity / piecePerPack / packPerBox : 0;
        return 0;
      case 'fixed':
        return 1;
      default:
        return 0;
    }
  }

  async calculateOrder(orderId: string) {
    const order = await this.ordersService.findDetail(orderId);
    if (!order) throw new NotFoundException('订单不存在');

    await this.theoreticalRepo.delete({ orderId });
    await this.varianceRepo.delete({ orderId });

    const result: any[] = [];

    for (const item of order.items || []) {
      const spec = await this.specRepo.findOne({ where: { id: item.spec.id } });
      for (const processType of ['weaving', 'bleaching', 'packaging']) {
        const bom = await this.bomService.findBySpecAndProcess(item.spec.id, processType);
        if (!bom) continue;

        for (const detail of bom.details || []) {
          const basisValue = this.getBasisValue(item, spec, detail.calcBasis);

          let qty = 0;
          if (detail.calcBasis === 'fixed') {
            qty = Number(detail.fixedValue || 0);
          } else {
            qty = (Number(basisValue) * Number(detail.numerator || 0)) / (Number(detail.denominator || 1));
          }

          qty = qty * (1 + Number(detail.lossRate || 0));

          const row = this.theoreticalRepo.create({
            orderId: order.id,
            orderItemId: item.id,
            specId: item.spec.id,
            processType,
            materialId: detail.materialId,
            quantity: Number(qty.toFixed(6)),
            unit: detail.calcBasis === 'fixed' ? 'fixed' : detail.calcBasis,
            sourceType: 'system',
            sourceId: bom.id,
          });

          const saved = await this.theoreticalRepo.save(row);
          result.push(saved);
        }
      }
    }

    await this.refreshVariance(orderId);
    return result;
  }

  async createActual(body: any, userId?: string) {
    const row = this.actualRepo.create({
      ...body,
      createdBy: userId,
    });
    const saved = await this.actualRepo.save(row);
    await this.refreshVariance(body.orderId);
    return saved;
  }

  async refreshVariance(orderId: string) {
    await this.varianceRepo.delete({ orderId });

    const theoreticalList = await this.theoreticalRepo.find({ where: { orderId } });
    const actualList = await this.actualRepo.find({ where: { orderId } });

    const groupMap = new Map<string, any>();

    for (const item of theoreticalList) {
      const key = `${item.orderItemId}|${item.processType}|${item.materialId}|${item.unit}`;
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          orderId: item.orderId,
          orderItemId: item.orderItemId,
          specId: item.specId,
          processType: item.processType,
          materialId: item.materialId,
          theoreticalQty: 0,
          actualQty: 0,
          unit: item.unit,
        });
      }
      groupMap.get(key).theoreticalQty += Number(item.quantity || 0);
    }

    for (const item of actualList) {
      const key = `${item.orderItemId}|${item.processType}|${item.materialId}|${item.unit}`;
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          orderId: item.orderId,
          orderItemId: item.orderItemId,
          specId: item.specId,
          processType: item.processType,
          materialId: item.materialId,
          theoreticalQty: 0,
          actualQty: 0,
          unit: item.unit,
        });
      }
      groupMap.get(key).actualQty += Number(item.quantity || 0);
    }

    const rows = [];
    for (const value of groupMap.values()) {
      const varianceQty = Number((value.actualQty - value.theoreticalQty).toFixed(6));
      const varianceRate = value.theoreticalQty > 0 ? Number((varianceQty / value.theoreticalQty).toFixed(6)) : 0;

      rows.push(
        this.varianceRepo.create({
          ...value,
          varianceQty,
          varianceRate,
        }),
      );
    }

    return this.varianceRepo.save(rows);
  }

  async summary(orderId: string) {
    return {
      theoretical: await this.theoreticalRepo.find({ where: { orderId } }),
      actual: await this.actualRepo.find({ where: { orderId } }),
      variance: await this.varianceRepo.find({ where: { orderId } }),
    };
  }
}

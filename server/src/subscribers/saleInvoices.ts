import { Container } from 'typedi';
import { On, EventSubscriber } from "event-dispatch";
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import SettingsService from 'services/Settings/SettingsService';
import SaleEstimateService from 'services/Sales/SalesEstimate';
@EventSubscriber()
export default class SaleInvoiceSubscriber {
  logger: any;
  tenancy: TenancyService;
  settingsService: SettingsService;
  saleEstimatesService: SaleEstimateService;

  constructor() {
    this.logger = Container.get('logger');
    this.tenancy = Container.get(TenancyService);
    this.settingsService = Container.get(SettingsService);
    this.saleEstimatesService = Container.get(SaleEstimateService);
  }

  /**
   * Handles customer balance increment once sale invoice created.
   */
  @On(events.saleInvoice.onCreated)
  public async handleCustomerBalanceIncrement({ tenantId, saleInvoice, saleInvoiceId }) {
    const { customerRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[sale_invoice] trying to increment customer balance.', { tenantId });
    await customerRepository.changeBalance(saleInvoice.customerId, saleInvoice.balance);
  }

  /**
   * 
   */
  @On(events.saleInvoice.onCreated)
  public async handleMarkEstimateConvert({ tenantId, saleInvoice, saleInvoiceId }) {
    if (saleInvoice.fromEstiamteId) {
      this.saleEstimatesService.convertEstimateToInvoice(
        tenantId,
        saleInvoice.fromEstiamteId,
        saleInvoiceId,
      );
    }
  }

  /**
   * Handles customer balance diff balnace change once sale invoice edited.
   */
  @On(events.saleInvoice.onEdited)
  public async onSaleInvoiceEdited({ tenantId, saleInvoice, oldSaleInvoice, saleInvoiceId }) {
    const { customerRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[sale_invoice] trying to change diff customer balance.', { tenantId });
    await customerRepository.changeDiffBalance(
      saleInvoice.customerId,
      saleInvoice.balance,
      oldSaleInvoice.balance,
      oldSaleInvoice.customerId,
    )
  }

  /**
   * Handles customer balance decrement once sale invoice deleted.
   */
  @On(events.saleInvoice.onDeleted)
  public async handleCustomerBalanceDecrement({ tenantId, saleInvoiceId, oldSaleInvoice }) {
    const { customerRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[sale_invoice] trying to decrement customer balance.', { tenantId });
    await customerRepository.changeBalance( 
      oldSaleInvoice.customerId,
      oldSaleInvoice.balance * -1,
    );
  }

  /**
   * Handles sale invoice next number increment once invoice created.
   */
  @On(events.saleInvoice.onCreated)
  public async handleInvoiceNextNumberIncrement({ tenantId, saleInvoiceId, saleInvoice }) {
    await this.settingsService.incrementNextNumber(tenantId, {
      key: 'next_number',
      group: 'sales_invoices',
    });
  }
}
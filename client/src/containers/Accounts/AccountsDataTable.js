import React from 'react';

import { TableFastCell, DataTable } from 'components';
import { compose } from 'utils';

import { useAccountsTableColumns, rowClassNames } from './utils';
import { ActionsMenu } from './components';

import TableVirtualizedListRows from 'components/Datatable/TableVirtualizedRows';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';
import { useAccountsChartContext } from './AccountsChartProvider';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

/**
 * Accounts data-table.
 */
function AccountsDataTable({
  // #withAlertsDialog
  openAlert,

  // #withDial
  openDialog,

  // #withDrawerActions
  openDrawer,
}) {
  const {
    isAccountsLoading,
    isAccountsFetching,
    accounts,
  } = useAccountsChartContext();

  // Retrieve accounts table columns.
  const columns = useAccountsTableColumns();

  // Handle delete action account.
  const handleDeleteAccount = (account) => {
    openAlert('account-delete', { accountId: account.id });
  };

  // Handle activate action account.
  const handleActivateAccount = (account) => {
    openAlert('account-activate', { accountId: account.id });
  };

  // Handle inactivate action account.
  const handleInactivateAccount = (account) => {
    openAlert('account-inactivate', { accountId: account.id });
  };

  // Handle select accounts datatable rows.
  //   const handleSelectedRowsChange = (selectedRows) => {
  //     const selectedRowsIds = selectedRows.map((r) => r.id);
  //     setSelectedRowsAccounts(selectedRowsIds);
  //   };

  // Handle edit account action.
  const handleEditAccount = (account) => {
    openDialog('account-form', { action: 'edit', id: account.id });
  };

  // Handle view detail account.
  const handleViewDetailAccount = ({ id }) => {
    openDrawer('account-drawer', { accountId: id });
  };

  // Handle new child button click.
  const handleNewChildAccount = (account) => {
    openDialog('account-form', {
      action: 'new_child',
      parentAccountId: account.id,
      accountType: account.account_type,
    });
  };
  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer('account-drawer', { accountId: cell.row.original.id });
  };

  return (
    <DataTable
      noInitialFetch={true}
      columns={columns}
      data={accounts}
      selectionColumn={true}
      expandable={true}
      sticky={true}
      loading={isAccountsLoading}
      headerLoading={isAccountsLoading}
      progressBarLoading={isAccountsFetching}
      rowClassNames={rowClassNames}
      autoResetExpanded={false}
      autoResetSortBy={false}
      autoResetSelectedRows={false}
      expandColumnSpace={1}
      expandToggleColumn={2}
      selectionColumnWidth={50}
      TableCellRenderer={TableFastCell}
      TableRowsRenderer={TableVirtualizedListRows}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      ContextMenu={ActionsMenu}
      // #TableVirtualizedListRows props.
      vListrowHeight={42}
      vListOverscanRowCount={0}
      onCellClick={handleCellClick}
      payload={{
        onEdit: handleEditAccount,
        onDelete: handleDeleteAccount,
        onActivate: handleActivateAccount,
        onInactivate: handleInactivateAccount,
        onNewChild: handleNewChildAccount,
        onViewDetails: handleViewDetailAccount,
      }}
    />
  );
}

export default compose(
  withAlertsActions,
  withDrawerActions,
  withDialogActions,
)(AccountsDataTable);

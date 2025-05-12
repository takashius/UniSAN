import { StyleSheet } from 'react-native';

const transactionsStyles = StyleSheet.create({
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyItemAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyItemDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#d1fae5', // Verde claro
  },
  statusReceived: {
    backgroundColor: '#bfdbfe', // Azul claro
  },
  statusInfo: {
    backgroundColor: '#ffe4d4', // Naranja claro
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  amountReceived: {
    color: '#10b981', // Verde
  },
  amountPaid: {
    color: '#ff7f50', // Naranja
  },
});

export default transactionsStyles;

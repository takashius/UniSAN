import { StyleSheet } from 'react-native';

const nextPaymentStyles = StyleSheet.create({
  paymentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff7f50',
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailsLabel: {
    fontSize: 12,
    color: '#888',
  },
  detailsValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentButton: {
    backgroundColor: '#ff7f50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default nextPaymentStyles;

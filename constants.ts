
import { Denomination } from './types';

export const BRL_DENOMINATIONS: Denomination[] = [
  { value: 200.0, label: 'R$ 200', type: 'note' },
  { value: 100.0, label: 'R$ 100', type: 'note' },
  { value: 50.0, label: 'R$ 50', type: 'note' },
  { value: 20.0, label: 'R$ 20', type: 'note' },
  { value: 10.0, label: 'R$ 10', type: 'note' },
  { value: 5.0, label: 'R$ 5', type: 'note' },
  { value: 2.0, label: 'R$ 2', type: 'note' },
  { value: 1.0, label: 'R$ 1', type: 'coin' },
  { value: 0.5, label: '50¢', type: 'coin' },
  { value: 0.25, label: '25¢', type: 'coin' },
  { value: 0.1, label: '10¢', type: 'coin' },
  { value: 0.05, label: '5¢', type: 'coin' },
];

export const FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

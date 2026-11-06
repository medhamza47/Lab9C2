import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import App from './App';

jest.mock('axios');

const comptes = [
  {
    id: 12,
    solde: 12500.5,
    dateCreation: '2025-02-14',
    type: 'COURANT',
  },
];

beforeEach(() => {
  axios.get.mockResolvedValue({ data: comptes });
  axios.post.mockResolvedValue({ data: { id: 13 } });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('displays the accounts returned by the API', async () => {
  render(<App />);

  expect(await screen.findByText('#12')).toBeInTheDocument();
  expect(screen.getByText(/12\s*500,50 MAD/)).toBeInTheDocument();
  expect(screen.getAllByText('Courant').length).toBeGreaterThan(0);
});

test('submits a new account and reloads the list', async () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText('Solde'), {
    target: { value: '8000' },
  });
  fireEvent.change(screen.getByLabelText('Date de création'), {
    target: { value: '2025-04-20' },
  });
  fireEvent.change(screen.getByLabelText('Type de compte'), {
    target: { value: 'EPARGNE' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Ajouter le compte' }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8082/api/comptes',
      {
        solde: 8000,
        dateCreation: '2025-04-20',
        type: 'EPARGNE',
      }
    );
    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});

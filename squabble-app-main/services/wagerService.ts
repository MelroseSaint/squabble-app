import { Bet, Transaction } from '../types';
import { updateUserBalance, createTransaction } from './db';

export const processWager = async (bet: Bet, user: any) => {
  // In a real app, you'd have a more sophisticated way of determining the winner
  const isWinner = Math.random() > 0.5;

  if (isWinner) {
    const winnings = bet.amount * (parseFloat(bet.odds) / 100);
    const newBalance = user.balance + winnings;
    await updateUserBalance(user.id, newBalance);

    const transaction: Transaction = {
      id: Date.now().toString(),
      user: user.id,
      type: 'BET_WIN',
      amount: winnings,
      status: 'COMPLETED',
      description: `Won bet on ${bet.fighterName}`,
      timestamp: Date.now(),
    };
    await createTransaction(transaction);
  } else {
    // The user's balance was already debited when the bet was placed
    const transaction: Transaction = {
        id: Date.now().toString(),
        user: user.id,
        type: 'BET_LOSS',
        amount: bet.amount,
        status: 'COMPLETED',
        description: `Lost bet on ${bet.fighterName}`,
        timestamp: Date.now(),
        };
    await createTransaction(transaction)
  }
};
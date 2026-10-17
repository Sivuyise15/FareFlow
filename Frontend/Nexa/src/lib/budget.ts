export type BudgetAlert = { title: string; message: string };

export type BudgetStatus = {
  usedPct: number; // 0..1+ (can exceed 1 when over budget)
  remaining: number;
  daysLeft: number; // including today
  perDayLeft: number;
  alert: BudgetAlert | null;
};

/**
 * An alert shows when the user is over budget, or has used noticeably more of
 * the budget than the share of the month that has passed.
 */
export function getBudgetStatus(spent: number, limit: number, now = new Date()): BudgetStatus {
  const usedPct = limit > 0 ? spent / limit : 0;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthPct = now.getDate() / daysInMonth;
  const remaining = limit - spent;
  const daysLeft = daysInMonth - now.getDate() + 1;
  const perDayLeft = Math.max(remaining, 0) / daysLeft;

  let alert: BudgetAlert | null = null;

  if (usedPct >= 1) {
    alert = {
      title: 'OVER BUDGET',
      message: "You've spent more than your monthly limit.",
    };
  } else if (usedPct - monthPct > 0.1) {
    alert = {
      title: 'SPENDING ALERT',
      message: `You've reached ${Math.round(usedPct * 100)}% of your budget earlier than expected this month.`,
    };
  }

  return { usedPct, remaining, daysLeft, perDayLeft, alert };
}

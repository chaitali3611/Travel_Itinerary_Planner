import React from 'react';
import { Wallet, TrendingUp, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

export function BudgetVarianceCard({
  budget = 0,
  overallTotal = 0,
  budgetCategory = 'Domestic Trip',
  isWithinBudget = true,
  budgetVariance = 0
}) {
  const percentageUsed = budget > 0 ? Math.min(150, (overallTotal / budget) * 100) : 0;
  const isOver = !isWithinBudget && budget > 0;

  return (
    <div className="budget-meter-card animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: isOver ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: isOver ? '#FB7185' : '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isOver ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem' }}>Budget Analysis & Financial Variance</h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Category: <strong>{budgetCategory}</strong>
            </div>
          </div>
        </div>

        {budget > 0 ? (
          <span className={`badge ${isOver ? 'badge-rose' : 'badge-emerald'}`}>
            {isOver
              ? `Over Budget by ₹${Math.abs(budgetVariance).toLocaleString('en-IN')}`
              : `Within Budget (₹${Math.abs(budgetVariance).toLocaleString('en-IN')} Saved)`}
          </span>
        ) : (
          <span className="badge badge-purple">No Target Budget Set</span>
        )}
      </div>

      {budget > 0 && (
        <>
          {/* Progress Bar */}
          <div className="budget-progress-track">
            <div
              className="budget-progress-fill"
              style={{
                width: `${Math.min(100, percentageUsed)}%`,
                background: isOver 
                  ? 'linear-gradient(90deg, #F59E0B, #EF4444)' 
                  : 'linear-gradient(90deg, #10B981, #0EA5E9)'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span>Spent: <strong>₹{overallTotal.toLocaleString('en-IN')}</strong> ({percentageUsed.toFixed(1)}%)</span>
            <span>Target Budget: <strong>₹{budget.toLocaleString('en-IN')}</strong></span>
          </div>
        </>
      )}
    </div>
  );
}

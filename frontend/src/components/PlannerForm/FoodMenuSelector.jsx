import React, { useState } from 'react';
import { Utensils, Plus, Minus, Check, Trash2, ShoppingBag } from 'lucide-react';

export function FoodMenuSelector({
  foodCatalog = { cuisines: {} },
  foodOrders = [], // [ { cuisine, item_name, quantity } ]
  onChangeFoodOrders
}) {
  const cuisines = Object.keys(foodCatalog.cuisines || {});
  const [activeCuisine, setActiveCuisine] = useState(cuisines[0] || 'Maharashtrian');

  // Helper to get ordered quantity of a dish
  const getItemQuantity = (itemName) => {
    const found = foodOrders.find(
      (order) => order.item_name.toLowerCase() === itemName.toLowerCase()
    );
    return found ? found.quantity : 0;
  };

  const updateItemQuantity = (cuisineName, itemName, delta) => {
    const existingIndex = foodOrders.findIndex(
      (order) => order.item_name.toLowerCase() === itemName.toLowerCase()
    );

    let updated = [...foodOrders];

    if (existingIndex >= 0) {
      const currentQty = updated[existingIndex].quantity;
      const nextQty = currentQty + delta;

      if (nextQty <= 0) {
        updated = updated.filter((_, i) => i !== existingIndex);
      } else {
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: nextQty
        };
      }
    } else if (delta > 0) {
      updated.push({
        cuisine: cuisineName,
        item_name: itemName,
        quantity: delta
      });
    }

    onChangeFoodOrders(updated);
  };

  const clearAllFood = () => {
    onChangeFoodOrders([]);
  };

  // Compute total food cost and plates count
  const allDishesMap = {};
  if (foodCatalog.cuisines) {
    Object.values(foodCatalog.cuisines).forEach((items) => {
      items.forEach((item) => {
        allDishesMap[item.name.toLowerCase()] = item.price;
      });
    });
  }

  const totalPlatesCount = foodOrders.reduce((sum, item) => sum + item.quantity, 0);
  const totalFoodCost = foodOrders.reduce((sum, item) => {
    const price = allDishesMap[item.item_name.toLowerCase()] || 0;
    return sum + price * item.quantity;
  }, 0);

  const currentCuisineDishes = foodCatalog.cuisines?.[activeCuisine] || [];

  return (
    <div style={{ marginTop: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Utensils size={18} color="#FBBF24" />
          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>
            Meals & Regional Dining ({totalPlatesCount} Items)
          </h4>
        </div>

        {totalPlatesCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FBBF24' }}>
              Subtotal: ₹{totalFoodCost.toLocaleString('en-IN')}
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={clearAllFood}
              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
        {/* Cuisine Navigation Tabs */}
        <div className="cuisine-tabs">
          {cuisines.map((cuisine) => {
            const isActive = activeCuisine === cuisine;
            const itemsInThisCuisine = foodOrders.filter(
              (o) => o.cuisine?.toLowerCase() === cuisine.toLowerCase()
            ).length;

            return (
              <button
                key={cuisine}
                type="button"
                className={`cuisine-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCuisine(cuisine)}
              >
                <span>{cuisine}</span>
                {itemsInThisCuisine > 0 && (
                  <span style={{ marginLeft: '6px', padding: '1px 6px', borderRadius: '99px', background: '#F59E0B', color: '#000', fontSize: '0.7rem', fontWeight: 800 }}>
                    {itemsInThisCuisine}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dishes in current cuisine */}
        <div className="grid-cols-3" style={{ gap: '10px' }}>
          {currentCuisineDishes.map((dish) => {
            const qty = getItemQuantity(dish.name);
            const isSelected = qty > 0;

            return (
              <div
                key={dish.name}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'rgba(18, 26, 43, 0.5)',
                  border: isSelected ? '1px solid #F59E0B' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? '#FDE68A' : 'var(--text-main)' }}>
                    {dish.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#FBBF24', fontWeight: 600, marginTop: '2px' }}>
                    ₹{dish.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="qty-counter">
                  {qty > 0 ? (
                    <>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateItemQuantity(activeCuisine, dish.name, -1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', minWidth: '18px', textAlign: 'center' }}>
                        {qty}
                      </span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateItemQuantity(activeCuisine, dish.name, 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => updateItemQuantity(activeCuisine, dish.name, 1)}
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                    >
                      <Plus size={12} />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Dishes Summary Basket */}
        {foodOrders.length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
              Planned Meal Orders:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {foodOrders.map((order, idx) => {
                const unitPrice = allDishesMap[order.item_name.toLowerCase()] || 0;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{order.item_name}</span>
                    <span style={{ color: '#FBBF24', fontWeight: 700 }}>x{order.quantity} (₹{unitPrice * order.quantity})</span>
                    <button
                      type="button"
                      onClick={() => updateItemQuantity(order.cuisine, order.item_name, -order.quantity)}
                      style={{ color: '#FB7185', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      title="Remove item"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

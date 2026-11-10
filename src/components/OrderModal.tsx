import React, { useState } from 'react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/menuData';
import { X, Check, Flame, ShoppingBag, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem?: MenuItem | null;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, selectedItem }) => {
  const [activeItem, setActiveItem] = useState<MenuItem>(selectedItem || MENU_ITEMS[0]);
  const [pattyCount, setPattyCount] = useState<number>(2); // 1, 2, or 3
  const [spiceLevel, setSpiceLevel] = useState<number>(activeItem.heatLevel);
  const [bunChoice, setBunChoice] = useState<'potatoroll' | 'brioche' | 'lettucewrap'>('potatoroll');
  const [extraSauce, setExtraSauce] = useState(false);
  const [addFries, setAddFries] = useState(false);
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryArea, setDeliveryArea] = useState('Al Quoz / Alserkal');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  // Calculate dynamic subtotal
  const basePrice = activeItem.priceAed;
  const pattyUpgrade = (pattyCount - 2) * 16;
  const sauceUpgrade = extraSauce ? 6 : 0;
  const friesUpgrade = addFries ? 24 : 0;
  const totalAed = Math.max(basePrice + pattyUpgrade + sauceUpgrade + friesUpgrade, 35);

  const handleConfirmOrder = () => {
    soundEffects.playSmash();
    const generatedId = `DXB-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(generatedId);
    setOrderPlaced(true);
  };

  const handleReset = () => {
    setOrderPlaced(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-2xl bg-[#141414] border-2 border-[#FFF6E5]/20 rounded-sm shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-[#1C1C1C] px-6 py-4 border-b border-[#FFF6E5]/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#D7261E] animate-ping" />
            <span className="font-['Barlow_Condensed'] font-black text-2xl uppercase tracking-wider text-[#FFF6E5]">
              {orderPlaced ? 'ORDER CONFIRMED' : 'SMASH CUSTOMIZER'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#FFF6E5]/60 hover:text-[#F2B705] p-1.5 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {orderPlaced ? (
          /* Receipt Card confirmation */
          <div className="p-8 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-[#F2B705] text-black mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(242,183,5,0.5)]">
              <Check className="w-9 h-9 stroke-[3]" />
            </div>

            <div>
              <div className="font-mono text-xs uppercase text-[#F2B705] tracking-widest">
                TICKET NUMBER
              </div>
              <div className="font-['Bebas_Neue'] text-6xl text-[#FFF6E5] tracking-wider mt-1">
                #{orderId}
              </div>
              <p className="font-['Space_Grotesk'] text-sm text-[#FFF6E5]/80 max-w-sm mx-auto mt-2">
                Your patty has been slammed onto 200°C cast iron at Warehouse 17, Al Quoz.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-[#0E0E0E] border border-dashed border-[#FFF6E5]/30 p-5 rounded-sm font-mono text-xs text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between border-b border-[#FFF6E5]/15 pb-2 text-[#FFF6E5]/60">
                <span>ITEM: {activeItem.name}</span>
                <span>{pattyCount}x WAGYU</span>
              </div>
              <div className="flex justify-between text-[#FFF6E5]/80">
                <span>BUN: {bunChoice.toUpperCase()}</span>
                <span>SPICE: {spiceLevel}X</span>
              </div>
              {extraSauce && (
                <div className="flex justify-between text-[#FFF6E5]/80">
                  <span>+ EXTRA SECRET SHACK SAUCE</span>
                  <span>6 AED</span>
                </div>
              )}
              {addFries && (
                <div className="flex justify-between text-[#FFF6E5]/80">
                  <span>+ LOADED WAGYU TALLOW FRIES</span>
                  <span>24 AED</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#FFF6E5]/20 pt-2 text-[#F2B705] font-bold text-sm">
                <span>TOTAL CHARGED ({orderType.toUpperCase()})</span>
                <span>{totalAed} AED</span>
              </div>
              <div className="text-[10px] text-emerald-400 pt-1 text-center font-sans uppercase">
                ESTIMATED READY TIME: 11 MINUTES
              </div>
            </div>

            <button
              onClick={handleReset}
              className="bg-[#F2B705] hover:bg-[#FFE066] text-black font-['Barlow_Condensed'] font-black text-xl uppercase tracking-wider px-8 py-3 rounded-sm cursor-pointer transition-transform hover:scale-105"
            >
              ORDER ANOTHER SMASH
            </button>
          </div>
        ) : (
          /* Order Configuration Form */
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Order Method Toggle */}
            <div className="grid grid-cols-2 gap-3 bg-[#0A0A0A] p-1.5 rounded-sm border border-[#FFF6E5]/10">
              <button
                onClick={() => setOrderType('pickup')}
                className={`py-2 text-xs font-mono uppercase font-bold tracking-wider rounded-xs transition-colors ${
                  orderType === 'pickup'
                    ? 'bg-[#F2B705] text-black shadow-md'
                    : 'text-[#FFF6E5]/60 hover:text-[#FFF6E5]'
                }`}
              >
                PICKUP (AL QUOZ 17)
              </button>
              <button
                onClick={() => setOrderType('delivery')}
                className={`py-2 text-xs font-mono uppercase font-bold tracking-wider rounded-xs transition-colors ${
                  orderType === 'delivery'
                    ? 'bg-[#F2B705] text-black shadow-md'
                    : 'text-[#FFF6E5]/60 hover:text-[#FFF6E5]'
                }`}
              >
                DUBAI FAST DELIVERY
              </button>
            </div>

            {/* Select Burger */}
            <div>
              <label className="font-mono text-xs text-[#F2B705] uppercase tracking-wider block mb-2">
                1. SELECT SMASH CREATION
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveItem(item);
                      setSpiceLevel(item.heatLevel);
                    }}
                    className={`p-2.5 text-left border rounded-xs transition-all ${
                      activeItem.id === item.id
                        ? 'border-[#F2B705] bg-[#F2B705]/15 text-[#FFF6E5]'
                        : 'border-[#FFF6E5]/10 bg-[#1C1C1C] text-[#FFF6E5]/70 hover:border-[#FFF6E5]/30'
                    }`}
                  >
                    <div className="font-['Barlow_Condensed'] font-black text-base uppercase leading-tight">
                      {item.name}
                    </div>
                    <div className="font-mono text-xs text-[#F2B705] mt-1">{item.priceAed} AED</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Patty Stack (1, 2, 3) */}
            <div>
              <label className="font-mono text-xs text-[#F2B705] uppercase tracking-wider block mb-2">
                2. WAGYU PATTY STACK
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { count: 1, label: 'SINGLE PATTY (90G)' },
                  { count: 2, label: 'DOUBLE PATTY (180G)' },
                  { count: 3, label: 'TRIPLE PATTY (270G)' },
                ].map((p) => (
                  <button
                    key={p.count}
                    onClick={() => setPattyCount(p.count)}
                    className={`py-3 px-2 text-center border rounded-xs font-mono text-xs transition-all ${
                      pattyCount === p.count
                        ? 'border-[#D7261E] bg-[#D7261E]/20 text-[#FFF6E5] font-bold'
                        : 'border-[#FFF6E5]/10 bg-[#1C1C1C] text-[#FFF6E5]/60 hover:border-[#FFF6E5]/30'
                    }`}
                  >
                    <div>{p.count}x PATTY</div>
                    <div className="text-[10px] text-[#FFF6E5]/50 mt-0.5">{p.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bun Preference */}
            <div>
              <label className="font-mono text-xs text-[#F2B705] uppercase tracking-wider block mb-2">
                3. BUN CARRIER
              </label>
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                {[
                  { id: 'potatoroll', name: 'MARTIN’S POTATO' },
                  { id: 'brioche', name: 'BUTTER BRIOCHE' },
                  { id: 'lettucewrap', name: 'BOWL / NAKED' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBunChoice(b.id as any)}
                    className={`py-2 px-1 text-center border rounded-xs transition-all ${
                      bunChoice === b.id
                        ? 'border-[#F2B705] bg-[#F2B705]/15 text-[#FFF6E5] font-bold'
                        : 'border-[#FFF6E5]/10 bg-[#1C1C1C] text-[#FFF6E5]/60'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div>
              <label className="font-mono text-xs text-[#F2B705] uppercase tracking-wider block mb-2">
                4. STREET EXTRAS
              </label>
              <div className="space-y-2 font-mono text-xs">
                <label className="flex items-center justify-between p-3 bg-[#1C1C1C] border border-[#FFF6E5]/10 rounded-xs cursor-pointer hover:border-[#FFF6E5]/30">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={extraSauce}
                      onChange={(e) => setExtraSauce(e.target.checked)}
                      className="accent-[#F2B705] w-4 h-4"
                    />
                    <span>EXTRA HOUSE SECRET SHACK SAUCE CUP</span>
                  </div>
                  <span className="text-[#F2B705]">+6 AED</span>
                </label>
                <label className="flex items-center justify-between p-3 bg-[#1C1C1C] border border-[#FFF6E5]/10 rounded-xs cursor-pointer hover:border-[#FFF6E5]/30">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={addFries}
                      onChange={(e) => setAddFries(e.target.checked)}
                      className="accent-[#F2B705] w-4 h-4"
                    />
                    <span>LOADED WAGYU TALLOW FRIES SIDE</span>
                  </div>
                  <span className="text-[#F2B705]">+24 AED</span>
                </label>
              </div>
            </div>

            {/* Delivery address field if delivery selected */}
            {orderType === 'delivery' && (
              <div>
                <label className="font-mono text-xs text-[#F2B705] uppercase tracking-wider block mb-1">
                  DELIVERY LOCATION IN DUBAI
                </label>
                <div className="flex items-center space-x-2 bg-[#1C1C1C] border border-[#FFF6E5]/15 px-3 py-2 rounded-xs">
                  <MapPin className="w-4 h-4 text-[#D7261E]" />
                  <input
                    type="text"
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value)}
                    placeholder="e.g. Downtown Dubai, JBR, Dubai Hills"
                    className="bg-transparent text-xs text-[#FFF6E5] w-full focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* Footer with subtotal & Smash CTA */}
            <div className="pt-4 border-t border-[#FFF6E5]/15 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#FFF6E5]/50 uppercase block">
                  SUBTOTAL (INCL. 5% VAT)
                </span>
                <span className="font-['Barlow_Condensed'] font-black text-3xl text-[#F2B705]">
                  {totalAed} AED
                </span>
              </div>
              <button
                onClick={handleConfirmOrder}
                className="bg-[#F2B705] hover:bg-[#FFE066] text-black font-['Barlow_Condensed'] font-black text-2xl uppercase tracking-wider px-8 py-3 rounded-xs shadow-[0_0_25px_rgba(242,183,5,0.4)] transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>CONFIRM & SMASH</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Utensils, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../audio/soundEngine';


interface MenuItem {
  id: string;
  name: string;
  hindiName: string;
  price: string;
  tag: string;
  description: string;
  icon: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Special Kadak Cutting Chai',
    hindiName: 'कड़क अदरक कुल्हड़ चाय',
    price: '₹15',
    tag: 'HIGHWAY BESTSELLER',
    description: 'Brewed with crushed ginger, green cardamom, and rich buffalo milk in traditional brass samovar.',
    icon: '☕'
  },
  {
    id: 'm2',
    name: 'Amritsari Aloo Paratha',
    hindiName: 'अमृतसरी आलू पराठा (सफ़ेद मक्खन)',
    price: '₹80',
    tag: 'SERVED WITH MAKKHAN',
    description: 'Crispy tandoor-baked spiced potato paratha loaded with handmade fresh white butter & green chilli pickle.',
    icon: '🫓'
  },
  {
    id: 'm3',
    name: 'Kulhad Malai Lassi',
    hindiName: 'ठंडी मलाई लस्सी',
    price: '₹60',
    tag: 'CHILLED REFRESHMENT',
    description: 'Thick churned sweet yogurt topped with thick rabri malai and crushed pistachio.',
    icon: '🥛'
  },
  {
    id: 'm4',
    name: 'Tandoori Dal Makhani & Roti',
    hindiName: 'दाल मखनी और तंदूरी रोटी',
    price: '₹140',
    tag: 'OVERNIGHT SLOW COOKED',
    description: 'Whole black lentils simmered overnight on charcoal fire with cream, butter, and garlic naan.',
    icon: '🍲'
  },
  {
    id: 'm5',
    name: 'Makki Di Roti & Sarson Saag',
    hindiName: 'मक्की दी रोटी और सरसों दा साग',
    price: '₹160',
    tag: 'SEASONAL DELICACY',
    description: 'Traditional Punjabi mustard greens cooked with spices, served with fresh corn flatbread and jaggery.',
    icon: '🌾'
  }
];

interface DhabaMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderChai: () => void;
}

export const DhabaMenuModal: React.FC<DhabaMenuModalProps> = ({ isOpen, onClose, onOrderChai }) => {
  if (!isOpen) return null;

  const handleOrder = (_item: MenuItem) => {
    soundEngine.playChaiPouringSound();
    onOrderChai();
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#ff8800', '#ffaa00', '#00a896']
    });
  };


  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-dhaba-wood border border-amber-500/40 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 border-b border-amber-500/30 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <h3 className="font-yatra text-xl text-amber-300 neon-text-orange">
              DHABA SPECIAL MENU (24/7 FRESH)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-amber-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items List */}
        <div className="p-4 overflow-y-auto space-y-3">
          {MENU_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950/90 border border-amber-500/20 hover:border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-md"
            >
              <div className="flex items-start space-x-3">
                <div className="text-3xl p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-yatra text-lg text-amber-300">{item.name}</h4>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-digital px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </div>
                  <div className="text-xs text-amber-400 font-kalam">{item.hindiName}</div>
                  <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                <div className="font-digital text-xl text-amber-400 font-bold">
                  {item.price}
                </div>
                <button
                  onClick={() => handleOrder(item)}
                  className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-transform active:scale-95 flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ORDER</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

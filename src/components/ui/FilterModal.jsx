import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FilterIcon, BookCoffeeIcon, FamilyIcon, HikingIcon,
  InstagramIcon, AncientCityIcon, AnimeIcon,
} from '../icons';
import { STYLE_OPTIONS, REGION_OPTIONS, DURATION_OPTIONS, THEMES } from '../../data/themes';

const STYLE_ICONS = {
  '美食控': AnimeIcon,
  '親子遊': FamilyIcon,
  '文青路線': BookCoffeeIcon,
  '戶外咖': HikingIcon,
  '網美派': InstagramIcon,
  '文化深度': AncientCityIcon,
};

export default function FilterModal({ onClose }) {
  const navigate = useNavigate();
  const [styles, setStyles] = useState([]);
  const [regions, setRegions] = useState([]);
  const [duration, setDuration] = useState('');

  const toggle = (arr, setArr, val) => {
    setArr((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const handleExplore = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    console.log('[FilterModal] handleExplore', { styles, regions, duration });
    const matched = THEMES.filter((t) => {
      const styleMatch = styles.length === 0 || styles.some((s) => (t.styles || []).includes(s));
      const regionMatch = regions.length === 0 || regions.some((r) => (t.regions || []).includes(r));
      const durationMatch = !duration || t.duration === duration;
      return styleMatch && regionMatch && durationMatch;
    });
    console.log('[FilterModal] matched:', matched.length);

    // Pass only IDs (THEME objects contain React components in `icon` which break structuredClone)
    const matchedIds = matched.map(t => t.id);

    if (matched.length === 0) {
      onClose();
      navigate('/explore', { state: { resultIds: [], filters: { styles, regions, duration } } });
      return;
    }

    if (matched.length === 1) {
      onClose();
      navigate(`/itinerary/${matched[0].id}`);
      return;
    }

    const cities = [...new Set(matched.map(t => t.city))];
    if (cities.length > 1) {
      onClose();
      navigate('/explore', { state: { resultIds: matchedIds, filters: { styles, regions, duration }, showCityPicker: true } });
    } else {
      onClose();
      navigate('/explore', { state: { resultIds: matchedIds, filters: { styles, regions, duration } } });
    }
  };

  const totalMatch = THEMES.filter((t) => {
    const styleMatch = styles.length === 0 || styles.some((s) => t.styles.includes(s));
    const regionMatch = regions.length === 0 || regions.some((r) => t.regions.includes(r));
    const durationMatch = !duration || t.duration === duration;
    return styleMatch && regionMatch && durationMatch;
  }).length;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#F0F0F0] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilterIcon size={20} color="#FF6B35" />
            <h2 className="text-lg font-bold text-[#333]">告訴我你想怎麼玩</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#999] hover:text-[#333] text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F5F5]"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Style selection */}
          <section>
            <h3 className="text-sm font-bold text-[#333] mb-3">選擇玩法風格 <span className="text-[#999] font-normal">（可複選）</span></h3>
            <div className="grid grid-cols-3 gap-2">
              {STYLE_OPTIONS.map(({ id, label }) => {
                const Icon = STYLE_ICONS[id] || FilterIcon;
                return (
                  <button
                    key={id}
                    className={`filter-tag ${styles.includes(id) ? 'active' : ''}`}
                    onClick={() => toggle(styles, setStyles, id)}
                  >
                    <Icon size={24} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Region selection */}
          <section>
            <h3 className="text-sm font-bold text-[#333] mb-3">想去哪些地方？ <span className="text-[#999] font-normal">（可複選）</span></h3>
            <div className="flex gap-2 flex-wrap">
              {REGION_OPTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  className={`filter-tag flex-row gap-2 ${regions.includes(id) ? 'active' : ''}`}
                  onClick={() => toggle(regions, setRegions, id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* Duration selection */}
          <section>
            <h3 className="text-sm font-bold text-[#333] mb-3">有多少時間？</h3>
            <div className="flex gap-2 flex-wrap">
              {DURATION_OPTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  className={`filter-tag flex-row gap-2 ${duration === id ? 'active' : ''}`}
                  onClick={() => setDuration(duration === id ? '' : id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="sticky bottom-0 bg-white border-t border-[#F0F0F0] px-6 py-4">
          <button
            className="btn-primary w-full py-3 text-base"
            onClick={handleExplore}
          >
            開始探索 ({totalMatch} 個玩法)
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';

/**
 * 顯示食尚玩家來源連結
 * 放在行程頁底部，展示所有推薦點的原始文章來源
 */
export default function SourceCitation({ spots }) {
  const [sources, setSources] = useState([]);
  const [communityRecs, setCommunityRecs] = useState([]);

  useEffect(() => {
    if (!spots?.length) return;

    const withUrls = [];
    const withoutUrls = [];

    spots.forEach((spot) => {
      const hasValidUrl =
        spot.article_url &&
        spot.article_url.includes('supertaste.tvbs.com.tw');

      if (hasValidUrl) {
        withUrls.push({ title: spot.article_title || spot.name, url: spot.article_url });
      } else if (spot.article_title || spot.name) {
        withoutUrls.push(spot.article_title || spot.name);
      }
    });

    // 去重
    const uniqueUrls = [
      ...new Map(withUrls.map((item) => [item.url, item])).values(),
    ];
    const uniqueNames = [...new Set(withoutUrls)];

    setSources(uniqueUrls);
    setCommunityRecs(uniqueNames);
  }, [spots]);

  if (!sources.length && !communityRecs.length) return null;

  return (
    <div className="mt-10 p-6 bg-[#FFF9E6] rounded-2xl border-l-4 border-[#FF6B35]">
      <h4 className="text-base font-bold text-[#333] mb-3">資料來源</h4>

      {sources.length > 0 && (
        <>
          <p className="text-sm text-[#666] mb-3">以下推薦來自食尚玩家精選文章：</p>
          <div className="flex flex-col gap-2 mb-4 max-h-72 overflow-y-auto">
            {sources.map((source, i) => (
              <div key={i} className="border-b border-[#F0E6D2] last:border-0 pb-2 last:pb-0">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#FF6B35] hover:text-[#E55A25] hover:translate-x-1 transition-all"
                >
                  <span className="text-[#999] font-semibold min-w-[28px]">
                    [{i + 1}]
                  </span>
                  <span className="flex-1 leading-snug">{source.title}</span>
                  <span className="text-xs opacity-60">↗</span>
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {communityRecs.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E0D4B8] p-3 mb-4">
          <p className="text-sm text-[#666] leading-relaxed">
            <span className="text-[#FF6B35] font-semibold mr-1">網友推薦：</span>
            {communityRecs.join('、')}
          </p>
        </div>
      )}

      <p className="text-xs text-[#999] border-t border-[#F0E6D2] pt-3">
        更多美食旅遊資訊請至{' '}
        <a
          href="https://supertaste.tvbs.com.tw"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF6B35] font-semibold hover:underline"
        >
          食尚玩家官網
        </a>
      </p>
    </div>
  );
}

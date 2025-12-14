import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getGeminiExplanation } from '../services/geminiService';
import { LatticeType, VoidType } from '../types';

interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
  lattice: LatticeType;
  voidType: VoidType;
}

const AiModal: React.FC<AiModalProps> = ({ isOpen, onClose, lattice, voidType }) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !content) {
      handleFetch();
    }
  }, [isOpen, lattice, voidType]);

  useEffect(() => {
      setContent('');
  }, [lattice, voidType]);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setContent('');
    
    // Updated prompt for Chinese explanation
    const prompt = `请用中文解释 ${lattice} (面心立方/体心立方) 晶体结构中的 ${voidType} (四面体/八面体) 空隙。
    1. 一个晶胞中有多少个这样的空隙？
    2. 它的配位数是多少？
    3. 半径比 (r/R) 是多少？
    请保持简洁，适合在网页侧边栏展示。`;

    try {
      // Safely access env variable
      const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
      
      if (!apiKey) {
          await new Promise(r => setTimeout(r, 1000));
          let staticResponse = `### ${lattice} - ${voidType === 'Tetrahedral' ? '四面体' : '八面体'}空隙\n\n`;
          if (lattice === 'FCC' && voidType === 'Tetrahedral') {
             staticResponse += "**数量:** 8 个/晶胞。\n\n**位置:** 8个小卦限的中心 ($$1/4, 1/4, 1/4$$ 等)。\n\n**构成:** 由1个顶点原子和3个面心原子围成。\n\n**半径比:** $$r/R \\approx 0.225$$";
          } else if (lattice === 'FCC' && voidType === 'Octahedral') {
             staticResponse += "**数量:** 4 个/晶胞 (1个体心 + 12个棱心，棱心由4个晶胞共有)。\n\n**位置:** 体心 ($$1/2, 1/2, 1/2$$) 和棱心。\n\n**半径比:** $$r/R \\approx 0.414$$";
          } else {
             staticResponse += "未检测到 API Key，无法生成详细解释。BCC 晶体的空隙通常比 FCC 更扁平。四面体空隙位于晶胞面上。";
          }
          setContent(staticResponse + "\n\n*(注: 如需实时 AI 生成，请配置 API_KEY)*");
      } else {
          const result = await getGeminiExplanation(prompt, apiKey);
          setContent(result);
      }

    } catch (err: any) {
      setError("获取解释失败。如果您在中国国内，请确保您有可以访问 Google 服务的网络环境，或者检查 API Key 是否正确。");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm select-none">
      <div className="bg-slate-800 border border-slate-600 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Sparkles className="text-emerald-400" size={20} /> AI 助教
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar text-slate-300 leading-relaxed">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-8 space-y-4">
               <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-sm animate-pulse">正在查询晶体学知识库...</p>
             </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-lg text-red-200 flex items-start gap-3">
               <AlertTriangle className="shrink-0 mt-1" size={18} />
               <p className="text-sm">{error}</p>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-900/50 rounded-b-2xl flex justify-between items-center">
            <span className="text-xs text-slate-500">Powered by Gemini 2.5 Flash</span>
            {!loading && content && (
                 <button onClick={handleFetch} className="text-xs text-emerald-400 hover:text-emerald-300 underline">
                    重新生成
                 </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default AiModal;
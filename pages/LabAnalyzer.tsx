
import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Search, Camera, X, FileSearch, Download, ShieldCheck, ClipboardCheck } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { LabAnalysisResult } from '../types';

const DnaCustom: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M10 16s-2.5-3.5-2.5-8 2.5-8 2.5-8"/>
    <path d="M14 16s2.5-3.5 2.5-8-2.5-8-2.5-8"/>
    <path d="M8 8h8M8 12h8M8 16h8"/>
  </svg>
);

export const LabAnalyzer: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [result, setResult] = useState<(LabAnalysisResult & { detectedType?: string }) | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit.");
        return;
      }
      setFile(selectedFile);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalysis = async () => {
    if (!preview || !file) return;

    setAnalyzing(true);
    setError(null);
    setShowConfirmDialog(false);
    
    try {
      const analysis = await GeminiService.analyzeLabReport(preview, file.type);
      
      if (!analysis.isValid) {
        setError("Please upload a valid medical test (Semen Analysis, Testosterone, or Ultrasound). This document does not appear to contain relevant medical diagnostics.");
        setAnalyzing(false);
        return;
      }

      setResult(analysis as any);
    } catch (error) {
      console.error(error);
      setError("AI Analysis failed. Please try again with a clearer image or different file.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="hidden print:block border-b-2 border-blue-600 pb-6 mb-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900">VaricoCare Diagnostic Report</h1>
            <p className="text-slate-500">AI-Powered Lab Interpretation</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-700">John Doe</p>
            <p className="text-xs text-slate-400">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <header className="text-center space-y-2 no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <FileSearch size={14} /> AI Diagnostics
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI Lab Analyzer</h1>
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
          Upload any medical report. Our AI will automatically identify the test type and provide a plain-English breakdown of your markers.
        </p>
      </header>

      {!result ? (
        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl shadow-blue-100 border border-white flex flex-col items-center gap-8 relative overflow-hidden no-print">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50 rounded-full -ml-16 -mb-16 blur-2xl"></div>

          <div className="w-full space-y-4 relative z-10">
            <p className="text-sm font-bold text-slate-700 ml-1">Upload or Scan Medical Document</p>
            <div 
              onClick={() => !file && fileInputRef.current?.click()}
              className={`w-full aspect-[16/9] md:aspect-[21/9] border-4 border-dashed rounded-[32px] flex flex-col items-center justify-center gap-4 transition-all duration-500 group relative overflow-hidden ${
                file 
                ? 'border-emerald-200 bg-emerald-50/30' 
                : 'border-slate-100 bg-slate-50/50 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,.pdf"
              />
              
              {preview ? (
                <div className="flex flex-col items-center gap-4 p-6 text-center animate-in zoom-in-95 duration-300 w-full h-full">
                  <div className="absolute inset-0 p-4">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-2xl opacity-40" />
                  </div>
                  <div className="relative z-10 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white flex flex-col items-center gap-4 shadow-xl">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 truncate max-w-[250px]">{file?.name}</p>
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">Ready for AI Verification</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFile(); }}
                      className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-xs transition-colors"
                    >
                      <X size={14} /> Remove and pick another
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-4">
                    <div className="p-5 bg-blue-100 rounded-[24px] text-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-blue-100">
                      <Upload size={32} />
                    </div>
                    <div className="p-5 bg-emerald-100 rounded-[24px] text-emerald-600 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-lg shadow-emerald-100">
                      <Camera size={32} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-800">Drop your test here</p>
                    <p className="text-sm text-slate-400 font-medium">Supports Semen, Testosterone, or Ultrasound reports</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="w-full p-6 bg-red-50 border border-red-100 rounded-[24px] flex items-start gap-4 text-red-600 animate-in slide-in-from-top-2">
              <AlertCircle size={24} className="shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-wider">Invalid Document Detected</p>
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowConfirmDialog(true)}
            disabled={analyzing || !file}
            className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
          >
            {analyzing ? (
              <>
                <Loader2 className="animate-spin text-blue-400" size={24} />
                <span className="animate-pulse">Clinical Scanning in Progress...</span>
              </>
            ) : (
              <>
                Start AI Analysis
              </>
            )}
          </button>
          
          <div className="flex items-center gap-3 text-slate-400">
             <ShieldCheck size={16} />
             <p className="text-[10px] font-black uppercase tracking-[0.2em]">Secured & HIPPA Compliant Processing</p>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 no-print">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-600 text-white rounded-xl">
                 <ClipboardCheck size={20} />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-slate-900">Analysis Results</h2>
                 <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Detected: {result.detectedType || "Medical Lab Report"}</p>
               </div>
            </div>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg"
            >
              <Download size={18} />
              Export PDF
            </button>
          </div>

          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-blue-50 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <div className="w-24 h-24 rounded-full border-8 border-blue-50 flex items-center justify-center mb-6 relative group-hover:border-blue-100 transition-all duration-500">
                <span className="text-4xl font-black text-blue-600">{result.riskScore}</span>
                <span className="text-slate-300 text-sm font-bold ml-0.5">/10</span>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Fertility Risk Score</p>
              <p className="text-sm font-bold text-slate-600">Based on clinical parameters</p>
            </div>
            
            <div className="md:col-span-2 bg-slate-900 p-10 rounded-[40px] text-white flex items-center relative shadow-2xl shadow-blue-900/10">
              <div className="absolute top-4 right-8 opacity-20 rotate-12 no-print">
                <DnaCustom size={80} />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="inline-block px-3 py-1 bg-emerald-500 text-[10px] font-black uppercase tracking-wider rounded-lg mb-2">
                   Status: {result.fertilityStatus}
                </div>
                <h3 className="text-3xl font-black leading-tight">AI Expert Breakdown</h3>
                <p className="text-slate-300 text-lg leading-relaxed font-medium">{result.summary}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-100 border border-slate-50 relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Improvement Plan</h3>
              </div>
              <ul className="space-y-6">
                {result.improvementPlan.map((step, i) => (
                  <li key={i} className="flex gap-4 group">
                    <span className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-sm font-black flex-shrink-0 transition-all duration-300 shadow-sm">
                      {i + 1}
                    </span>
                    <p className="text-slate-600 font-semibold leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-100 border border-slate-50 relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Lifestyle Tweaks</h3>
              </div>
              <ul className="space-y-6">
                {result.suggestions.map((sug, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-2 shrink-0 shadow-sm shadow-amber-200"></div>
                    <p className="text-slate-600 font-semibold leading-relaxed">{sug}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 pt-10 no-print">
            <button
              onClick={() => { setResult(null); removeFile(); }}
              className="px-10 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2 group"
            >
              <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
              Analyze Another Document
            </button>
            <p className="text-xs text-slate-400 font-medium italic">
              Disclaimer: This AI analysis is for educational purposes only and is not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 no-print">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setShowConfirmDialog(false)}
          ></div>
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 p-10 text-center space-y-8 border border-white">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle size={48} />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Verify Document</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Is this uploaded document a <span className="font-bold text-slate-800 underline decoration-blue-200 decoration-2">Semen Analysis</span>, <span className="font-bold text-slate-800 underline decoration-blue-200 decoration-2">Testosterone Report</span>, or <span className="font-bold text-slate-800 underline decoration-blue-200 decoration-2">Scrotal Ultrasound</span>?
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button 
                onClick={handleAnalysis}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
              >
                Yes, Start Analysis
              </button>
              <button 
                onClick={() => { setShowConfirmDialog(false); removeFile(); }}
                className="w-full bg-slate-50 text-slate-500 py-4 rounded-2xl font-black text-sm hover:bg-red-50 hover:text-red-500 transition-all uppercase tracking-widest"
              >
                No, Pick Another File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

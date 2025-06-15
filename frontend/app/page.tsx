'use client'
import { useState } from "react";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginFileValidateType);

export default function OGToolLanding() {
  const [pond, setPond] = useState(null);
  const [activeTab, setActiveTab] = useState('pdf');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Web scraping form state
  const [webForm, setWebForm] = useState({
    source: 'https://interviewing.io/topics',
    tagForArticleLinks: '.flex-1.px-1.py-2.hover\\\\:bg-gray-100 > a[href^=\\"/guides/\\"]',
    titleTag: '.font-serif.text-\\\\[56px\\\\].text-white-100',
    markdownTag: '.mb-\\\\[128px\\\\].gap-\\\\[20px\\\\].flex-col',
    selector: 'href'
  });

  // Helper function to safely get content as string
  const getContentAsString = (content) => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    
    if (Array.isArray(content)) {
      return content.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          // Handle objects with title and data properties
          if (item.title && item.data) {
            return `# ${item.title}\n\n${item.data}`;
          }
          
          // Try other common text properties
          if (item.text) return item.text;
          if (item.content) return item.content;
          if (item.markdown) return item.markdown;
          if (item.html) return item.html;
          if (item.data) return item.data;
          if (item.title) return item.title;
          
          // If it's an object with multiple properties, format it nicely
          const entries = Object.entries(item);
          if (entries.length === 1) {
            return entries[0][1]; // Return the single value
          }
          
          // Format as key-value pairs for readability
          return entries
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        }
        return String(item);
      }).join('\n\n---\n\n'); // Use separator between articles
    }
    
    if (typeof content === 'object') {
      // Handle single object with title and data
      if (content.title && content.data) {
        return `# ${content.title}\n\n${content.data}`;
      }
      
      // Try other common text properties
      if (content.text) return content.text;
      if (content.content) return content.content;
      if (content.markdown) return content.markdown;
      if (content.html) return content.html;
      if (content.data) return content.data;
      if (content.title) return content.title;
      
      // Fallback to formatted JSON
      return JSON.stringify(content, null, 2);
    }
    
    return String(content);
  };

  // Helper function to get content length
  const getContentLength = (content) => {
    const contentStr = getContentAsString(content);
    return contentStr.length;
  };

  const handleWebFormChange = (field, value) => {
    setWebForm(prev => ({ ...prev, [field]: value }));
  };

  const handleWebScrape = async () => {
    if (!webForm.source || !webForm.tagForArticleLinks || !webForm.titleTag || !webForm.markdownTag) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const endpoint = webForm.selector === 'click' 
        ? 'http://localhost:3001/api/v1/click'
        : 'http://localhost:3001/api/v1/href';
      
      // Log what we're sending to debug
      const payload = {
        source: webForm.source,
        tagForArticleLinks: webForm.tagForArticleLinks,
        titleTag: webForm.titleTag,
        markdownTag: webForm.markdownTag
      };
      
      console.log('Sending payload:', payload);
      console.log('JSON stringified:', JSON.stringify(payload));
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Received data:', data); // Debug log
      setResult(data);
    } catch (error) {
      console.error('Web scraping failed:', error);
      alert(`Failed to scrape URL: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    if (pond) {
      pond.removeFiles();
    }
    setWebForm({
      source: '',
      tagForArticleLinks: '',
      titleTag: '',
      markdownTag: '',
      selector: 'href'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="text-center py-16 px-4">
        <h1 className="text-8xl font-black text-white mb-4 tracking-tight">
          OG<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">TOOL</span>
        </h1>
        <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
          Extract and scrape content from PDFs and web pages with powerful AI-driven parsing
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Panel - Input Methods */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
            {/* Tab Switcher */}
            <div className="flex mb-8 bg-white/5 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('pdf')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  activeTab === 'pdf'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                📄 PDF Upload
              </button>
              <button
                onClick={() => setActiveTab('web')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  activeTab === 'web'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                🌐 Web Scraper
              </button>
            </div>

            {/* PDF Upload Tab */}
            {activeTab === 'pdf' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Upload PDF Document</h3>
                <FilePond
                  ref={(ref) => setPond(ref)}
                  allowMultiple={false}
                  acceptedFileTypes={["application/pdf"]}
                  labelIdle='Drag & Drop PDF or <span class="filepond--label-action">Browse</span>'
                  name="filepond"
                  className="filepond-custom"
                  server={{
                    process: {
                      url: "/api/upload",
                      method: "POST",
                      withCredentials: false,
                      onload: (response) => {
                        console.log("upload response", response);
                        const resumeDetail = JSON.parse(response);
                        setResult(resumeDetail);
                        return response;
                      },
                      onerror: (error) => {
                        alert("Failed to parse PDF. Please try another file.");
                        return error;
                      },
                    },
                    fetch: null,
                    revert: null,
                  }}
                />
              </div>
            )}

            {/* Web Scraper Tab */}
            {activeTab === 'web' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Web Content Scraper</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Source URL</label>
                    <input
                      type="url"
                      value={webForm.source}
                      onChange={(e) => handleWebFormChange('source', e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tag for Article Links</label>
                    <input
                      type="text"
                      value={webForm.tagForArticleLinks}
                      onChange={(e) => handleWebFormChange('tagForArticleLinks', e.target.value)}
                      placeholder="CSS selector for article links"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title Tag</label>
                    <input
                      type="text"
                      value={webForm.titleTag}
                      onChange={(e) => handleWebFormChange('titleTag', e.target.value)}
                      placeholder="CSS selector for title"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Markdown Tag</label>
                    <input
                      type="text"
                      value={webForm.markdownTag}
                      onChange={(e) => handleWebFormChange('markdownTag', e.target.value)}
                      placeholder="CSS selector for content"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Selector Type</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="href"
                          checked={webForm.selector === 'href'}
                          onChange={(e) => handleWebFormChange('selector', e.target.value)}
                          className="mr-2 text-blue-500"
                        />
                        <span className="text-white">Href</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="click"
                          checked={webForm.selector === 'click'}
                          onChange={(e) => handleWebFormChange('selector', e.target.value)}
                          className="mr-2 text-blue-500"
                        />
                        <span className="text-white">Click</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setWebForm({
                        source: 'https://interviewing.io/topics',
                        tagForArticleLinks: '.flex-1.px-1.py-2.hover\\\\:bg-gray-100 > a[href^=\\"/guides/\\"]',
                        titleTag: '.font-serif.text-\\\\[56px\\\\].text-white-100',
                        markdownTag: '.mb-\\\\[128px\\\\].gap-\\\\[20px\\\\].flex-col',
                        selector: 'href'
                      })}
                      className="px-4 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Use Example
                    </button>
                    <button
                      onClick={handleWebScrape}
                      disabled={loading}
                      className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? 'Scraping...' : 'Start Scraping'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Results</h3>
              {result && (
                <button
                  onClick={clearResult}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {!result ? (
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-lg">No data processed yet</p>
                  <p className="text-sm">Upload a PDF or scrape a URL to see results</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Result Header */}
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Title:</span>
                      <p className="text-white font-medium">{result.title || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <p className="text-white font-medium capitalize">{result.content_type || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Author:</span>
                      <p className="text-white font-medium">{result.author || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Content Length:</span>
                      <p className="text-white font-medium">{getContentLength(result.content)} chars</p>
                    </div>
                  </div>
                  {result.source_url && (
                    <div className="mt-3">
                      <span className="text-gray-400">Source:</span>
                      <p className="text-blue-400 break-all text-sm">{result.source_url}</p>
                    </div>
                  )}
                </div>

                {/* Content Preview */}
                <div className="bg-white/5 rounded-lg border border-white/10 max-h-96 overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <h4 className="text-white font-semibold">Content Preview</h4>
                  </div>
                  <div className="p-4 h-80 overflow-y-auto">
                    <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                      {(() => {
                        const contentStr = getContentAsString(result.content);
                        return contentStr.length > 2000 
                          ? contentStr.substring(0, 2000) + '...' 
                          : contentStr;
                      })()}
                    </pre>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button 
                    onClick={() => navigator.clipboard.writeText(getContentAsString(result.content))}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    📋 Copy Content
                  </button>
                  <button 
                    onClick={() => {
                      const contentStr = getContentAsString(result.content);
                      const blob = new Blob([contentStr], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${(result.title || 'content').replace(/[^a-z0-9]/gi, '_')}.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    💾 Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

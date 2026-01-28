'use client'

import Image from 'next/image'

export function LoginPreviewPanel() {
  return (
    <div className="hidden lg:block absolute top-8 left-8 bottom-8 w-[calc(50%-15px)] rounded-4xl overflow-visible bg-gradient-to-b from-purple-400 to-primary-dark">
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5"
        style={{ aspectRatio: '520/480' }}
      >

        <div 
          className="absolute inset-0 bg-background-light shadow-lg overflow-hidden" 
          style={{ 
            borderRadius: 'clamp(1rem, 2vw, 1.875rem)',
            fontSize: 'clamp(0.75rem, 0.75vw, 1.125rem)'
          }}
        >
        
          <div className="h-full flex flex-col" style={{ padding: 'clamp(1.5em, 8%, 2em)' }}>
         
            <h1 className="text-[1.875em] font-bold text-text mb-2 leading-tight text-center break-words overflow-hidden">
              AI Powered by{' '}
              <span className="text-purple-400">your life</span>
              <br />
              to help your daily routine.
            </h1>
            
        
            <p className="text-[0.875em] text-text mb-4 text-center leading-relaxed break-words overflow-hidden">
              warpSpeed is the most personal AI partner,
              <br />
              designed to improve your productivity
            </p>

            {/* Chat Bubble Preview */}
            <div className="flex-1 flex flex-col justify-end min-h-0">
    
              <div className="flex-1 flex flex-col items-center justify-center mb-3 min-h-0">
                <p className="text-text text-center text-[1.875em] font-medium mb-3 break-words overflow-hidden">
                  Hello there !
                </p>
                
                <div className="flex flex-col gap-2 items-center w-full">
          
                  <div className="h-3.5 w-2/5 max-w-32 rounded-full bg-preview-bar"></div>
      
                  <div className="h-3.5 w-4/5 max-w-52 rounded-full bg-preview-bar"></div>
                </div>
              </div>

    
              <div className="relative bg-background-light border border-gray-200 shadow-sm rounded-xl">
                <div className="flex items-center p-3 gap-3">
                  <span className="text-gray-400 text-sm flex-1 truncate">Ask me Anything</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
            
                    <div className="flex items-center justify-center text-gray-400 w-7 h-7">
                      <svg className="w-3/5 h-3/5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </div>
    
                    <div className="flex items-center justify-center text-gray-400 w-7 h-7">
                      <svg className="w-3/5 h-3/5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <div className="bg-primary-dark rounded-full flex items-center justify-center w-9 h-9">
                      <svg className="w-1/2 h-1/2 text-white rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute z-10 w-[16%] aspect-square rounded-2.5xl flex items-center justify-center shadow-lg border border-white/30 -top-[8%] -left-[10%] bg-white/75 backdrop-blur-xl">
          <svg
            className="w-[45%] h-[45%] text-darkBlue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>


        <div className="absolute z-10 w-[16%] aspect-square rounded-2.5xl flex items-center justify-center shadow-lg border border-white/30 top-[18%] -right-[10%] bg-white/75 backdrop-blur-xl">
          <svg
            className="w-[45%] h-[45%] text-darkBlue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>

        <div className="absolute z-10 w-[16%] aspect-square rounded-2.5xl flex items-center justify-center shadow-lg border border-white/30 bottom-[8%] -left-[10%] bg-white/75 backdrop-blur-xl">
          <svg
            className="w-[45%] h-[45%] text-darkBlue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>

        <div className="absolute z-10 w-[16%] aspect-square rounded-2.5xl flex items-center justify-center shadow-lg border border-white/30 -bottom-[8%] -right-[10%] bg-white/75 backdrop-blur-xl">
          <svg
            className="w-[45%] h-[45%] text-darkBlue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

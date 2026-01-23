'use client'

import Image from 'next/image'

export function LoginPreviewPanel() {
  return (
    <div 
      className="hidden lg:block absolute top-[30px] left-[30px] bottom-[30px] w-[calc(50%-15px)] rounded-[30px] overflow-visible"
      style={{
        background: 'linear-gradient(180deg, #4D3D99 0%, #1A7A7A 100%)',
      }}
    >
      {/* Container for white box AND icons - Same centering, icons positioned relative to this */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[61%]"
        style={{ aspectRatio: '520/480' }}
      >
        {/* Inner White Box */}
        <div 
          className="absolute inset-0 bg-white shadow-lg overflow-hidden" 
          style={{ 
            borderRadius: 'clamp(1rem, 2vw, 1.875rem)',
            // Base font size scales proportionally with white box container
            // White box is 61% of gradient container (~50vw), so approximately 30.5vw
            // Increased max to 1.125rem for better readability on larger screens
            // Using 0.75vw provides proportional scaling that matches container size
            fontSize: 'clamp(0.75rem, 0.75vw, 1.125rem)'
          }}
        >
          {/* Content inside white box - responsive padding using em */}
          <div className="h-full flex flex-col" style={{ padding: 'clamp(1.5em, 8%, 2em)' }}>
            {/* Heading - using em units for proportional scaling */}
            <h1 className="text-[1.875em] font-bold text-black mb-[0.5em] leading-tight text-center break-words overflow-hidden">
              AI Powered by{' '}
              <span className="text-[#4D3D99]">your life</span>
              <br />
              to help your daily routine.
            </h1>
            
            {/* Sub-text - using em units */}
            <p className="text-[0.875em] text-black/70 mb-[1em] text-center leading-relaxed break-words overflow-hidden">
              warpSpeed is the most personal AI partner,
              <br />
              designed to improve your productivity
            </p>

            {/* Chat Bubble Preview */}
            <div className="flex-1 flex flex-col justify-end min-h-0">
              {/* Hello message - centered horizontally and vertically */}
              <div className="flex-1 flex flex-col items-center justify-center mb-[0.75em] min-h-0">
                <p className="text-black text-center text-[1.875em] font-medium mb-[0.75em] break-words overflow-hidden">
                  Hello there !
                </p>
                {/* Progress bars decoration - stacked vertically, centered - using em for spacing */}
                <div className="flex flex-col gap-[0.5em] items-center w-full">
                  {/* Top bar - shorter - responsive width */}
                  <div className="h-[0.875em] w-[40%] max-w-[8rem] rounded-full bg-[#EDE6F1]"></div>
                  {/* Bottom bar - longer - responsive width */}
                  <div className="h-[0.875em] w-[80%] max-w-[13rem] rounded-full bg-[#EDE6F1]"></div>
                </div>
              </div>

              {/* Input Field Preview - Static - responsive sizing using em */}
              <div className="relative bg-white border border-gray-200 shadow-sm" style={{ borderRadius: '0.75em' }}>
                <div className="flex items-center" style={{ padding: 'clamp(0.75em, 2.5%, 1em)', gap: '0.75em' }}>
                  <span className="text-gray-400 text-[0.875em] flex-1 truncate">Ask me Anything</span>
                  <div className="flex items-center gap-[0.5em] flex-shrink-0">
                    {/* Paperclip icon - responsive size using em */}
                    <div className="flex items-center justify-center text-gray-400" style={{ width: '1.75em', height: '1.75em' }}>
                      <svg className="w-[60%] h-[60%]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </div>
                    {/* Microphone icon - responsive size using em */}
                    <div className="flex items-center justify-center text-gray-400" style={{ width: '1.75em', height: '1.75em' }}>
                      <svg className="w-[60%] h-[60%]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    {/* Send button - responsive size using em */}
                    <div className="bg-[#1A7A7A] rounded-full flex items-center justify-center" style={{ width: '2.25em', height: '2.25em' }}>
                      <svg className="w-[50%] h-[50%] text-white rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Icons - Positioned relative to the white box container */}
        {/* Using negative percentages to position outside the white box edges */}
        
        {/* Top-left icon - CALENDAR - overlapping top-left corner */}
        {/* Slightly purple tint from gradient behind */}
        <div 
          className="absolute z-10 w-[16%] aspect-square rounded-[clamp(0.75rem,1.5vw,1.25rem)] flex items-center justify-center shadow-lg border border-white/30"
          style={{
            top: '-8%',
            left: '-10%',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <svg
            className="w-[45%] h-[45%] text-[#2F2F4B]"
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

        {/* Top-right icon - PEN/EDIT - overlapping right edge, about 1/3 down */}
        {/* Slightly purple/teal tint from gradient behind */}
        <div 
          className="absolute z-10 w-[16%] aspect-square rounded-[clamp(0.75rem,1.5vw,1.25rem)] flex items-center justify-center shadow-lg border border-white/30"
          style={{
            top: '18%',
            right: '-10%',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <svg
            className="w-[45%] h-[45%] text-[#2F2F4B]"
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

        {/* Bottom-left icon - CLOCK - overlapping left edge, near input field */}
        {/* Slightly teal tint from gradient behind */}
        <div 
          className="absolute z-10 w-[16%] aspect-square rounded-[clamp(0.75rem,1.5vw,1.25rem)] flex items-center justify-center shadow-lg border border-white/30"
          style={{
            bottom: '8%',
            left: '-10%',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <svg
            className="w-[45%] h-[45%] text-[#2F2F4B]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>

        {/* Bottom-right icon - CHECKMARK - overlapping bottom-right corner */}
        {/* Slightly teal tint from gradient behind */}
        <div 
          className="absolute z-10 w-[16%] aspect-square rounded-[clamp(0.75rem,1.5vw,1.25rem)] flex items-center justify-center shadow-lg border border-white/30"
          style={{
            bottom: '-8%',
            right: '-10%',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <svg
            className="w-[45%] h-[45%] text-[#2F2F4B]"
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
